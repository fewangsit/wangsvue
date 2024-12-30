<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue';
import { Pbi, AssignedMember } from './DialogDetailPbi.vue.d';
import { filterFieldsMember } from './options/memberFilterFields';
import {
  TableColumn,
  TableCellComponent,
  QueryParams,
  FetchResponse,
} from '../datatable/DataTable.vue.d';
import { MenuItem } from '../menuitem';
import { getProjectPermission, useToast } from 'lib/utils';
import { SprintServices, getImageURL } from 'wangsit-api-services';
import { Project } from 'lib/types/project.type';
import UserName from '../username/UserName.vue';
import BadgeGroup from '../badgegroup/BadgeGroup.vue';
import Dialog from '../dialog/Dialog.vue';
import TabMenu from '../tabmenu/TabMenu.vue';
import ButtonBulkAction from '../buttonbulkaction/ButtonBulkAction.vue';
import ButtonSearch from '../buttonsearch/ButtonSearch.vue';
import ButtonFilter from '../buttonfilter/ButtonFilter.vue';
import FilterContainer from '../filtercontainer/FilterContainer.vue';
import DataTable from '../datatable/DataTable.vue';
import DialogConfirm from '../dialogconfirm/DialogConfirm.vue';
import eventBus from 'lib/event-bus';

const toast = useToast();

const props = defineProps<{
  pbiBody?: Pbi;
  project?: Project;
}>();

const emit = defineEmits<{
  add: [void];
}>();

const projectId = sessionStorage.getItem('projectId') as string;

const tableColumns: TableColumn[] = [
  {
    header: 'Member',
    field: 'member',
    sortable: true,
    bodyComponent: (data: AssignedMember): TableCellComponent => {
      return {
        component: UserName,
        props: {
          user: {
            ...data,
            profilePicture: getImageURL(data.imageUrl),
          },
        },
      };
    },
  },
  {
    header: 'Tim',
    field: 'team',
    sortable: true,
    bodyComponent: (data: AssignedMember): TableCellComponent => {
      return {
        component: BadgeGroup,
        props: {
          headerLabel: 'Tim',
          labels: data.team,
          limit: 2,
          emptyable: true,
        },
      };
    },
  },
  {
    header: 'Progres',
    field: 'progress',
    sortable: true,
  },
];

const bulkOptions: MenuItem[] = [
  {
    label: 'Assign',
    icon: 'user-received-2-line',
    visible: getProjectPermission(props.project).create,
    command: (): void => {
      assignMember(true, true);
    },
  },
];

const visibleConfirmUnassign = shallowRef<boolean>(false);
const visibleConfirmTransferTask = shallowRef<boolean>(false);
const activeTab = shallowRef<number>(0);
const selectedMember = shallowRef<AssignedMember>();
const assignedMembers = ref<AssignedMember[]>([]);
const selectedMembers = ref<AssignedMember[]>([]);

const totalMembers = ref<Record<'assigned' | 'unassigned', number>>({
  assigned: 0,
  unassigned: 0,
});

const pbiId = computed<string>(() => {
  return props.pbiBody?._id ?? '';
});

const memberMenu = computed<MenuItem[]>(() => {
  return [
    {
      label: `Assigned (${totalMembers.value.assigned})`,
    },
    {
      label: `Unassigned (${totalMembers.value.unassigned})`,
    },
  ];
});

const singleAction = (assignSection: boolean): MenuItem[] => {
  let selectedMemberHasCompleteTasks: boolean | undefined = false;
  let isAllTaskCompleted: boolean | undefined = false;
  if ((selectedMember.value?.tasks?.length ?? 0) > 0) {
    selectedMemberHasCompleteTasks = selectedMember.value?.tasks?.some(
      (task) => task.status === 'Selesai',
    );
    isAllTaskCompleted = selectedMember.value?.tasks?.every(
      (task) => task.status === 'Selesai',
    );
  }

  return [
    {
      label: 'Assign',
      icon: 'user-received-2-line',
      visible: !assignSection && getProjectPermission(props.project).create,
      command: (): void => {
        assignMember(!assignSection, false);
      },
    },
    {
      label: 'Unassign',
      icon: 'user-unfollow-line',
      visible:
        assignSection &&
        !isAllTaskCompleted &&
        getProjectPermission(props.project).delete,
      command: (): void => {
        if (selectedMemberHasCompleteTasks) {
          visibleConfirmTransferTask.value = true;
        } else {
          visibleConfirmUnassign.value = true;
        }
      },
    },
    {
      label: 'Detail Member',
      icon: 'file-copy-2-line',
    },
  ];
};

const showDialog = (): void => {
  activeTab.value = 0;
  let section: 'assigned' | 'unassigned';
  for (section in totalMembers.value) {
    totalMembers.value[section] = 0;
  }
};

const fetchMember = (tabIndex: number): void => {
  eventBus.emit('data-table:update', {
    tableName: `product-backlog-items-member-${tabIndex === 0}`,
  });
};

const getPbiAssignedMembers = async (
  query: QueryParams & {
    assign: boolean;
  },
): Promise<FetchResponse | undefined> => {
  try {
    // If in unassigned tab, only show members according to the PBI's category
    let defaultTeam: string | undefined;
    if (props.pbiBody?.category === 'Dokumentasi') defaultTeam = '["TW"]';
    else defaultTeam = '["BE","DEV","FE","IOT","MOB","QC","UIUX"]';
    if (!query.assign && !query.team) query.team = defaultTeam;

    const { data } = await SprintServices.getPbiAssignedMembers(
      projectId,
      pbiId.value,
      query.assign,
      { ...query, assign: undefined },
    );

    totalMembers.value[query.assign ? 'assigned' : 'unassigned'] =
      data.data.totalRecords;
    if (query.assign)
      assignedMembers.value = data.data.data as AssignedMember[];

    return data;
  } catch (error) {
    console.error(error);
  }
};

const assignMember = async (
  isAssign: boolean,
  isBulkAssign: boolean,
): Promise<void> => {
  try {
    let message: string;
    if (isAssign) {
      message = 'Member telah di-assign ke PBI.';
      const singleMember: string[] = selectedMember.value
        ? [selectedMember.value._id]
        : [];

      await SprintServices.assignPbiMembers(projectId, pbiId.value, {
        memberIds: isBulkAssign
          ? selectedMembers.value.map((member) => member._id)
          : singleMember,
      });
    } else {
      message = 'Member telah di-unassign dari PBI.';
      await SprintServices.unassignPbiMember(projectId, pbiId.value, {
        memberId: selectedMember.value?._id ?? '',
      });
    }

    toast.add({
      message,
      severity: 'success',
    });
    emit('add');
    eventBus.emit('data-table:clear-selected-data', {
      tableName: 'product-backlog-items-member-false',
    });
    eventBus.emit('data-table:update', {
      tableName: 'product-backlog-items-member-false',
    });
    eventBus.emit('data-table:update', {
      tableName: 'product-backlog-items-member-true',
    });
  } catch (error) {
    toast.add({
      error,
      message: `Member gagal di-${isAssign ? 'assign ke' : 'unassign dari'} PBI.`,
    });
    console.error(error);
  }
};
</script>

<template>
  <Dialog @show="showDialog" class="w-[800px]" header="Edit Member Pengerjaan">
    <template #default>
      <div class="flex gap-3">
        <span>Sprint : Sprint {{ pbiBody?.sprint?.key }}</span>
        <span>Product Backlog Item : {{ pbiBody?.name }}</span>
      </div>
      <div>
        <TabMenu
          v-model:active-index="activeTab"
          :menu="memberMenu"
          @update:active-index="fetchMember($event)"
        />
      </div>

      <template :key="assignSection" v-for="assignSection in [true, false]">
        <div
          v-show="assignSection ? activeTab === 0 : activeTab === 1"
          class="flex flex-col gap-2"
        >
          <div class="flex justify-between">
            <div class="content-center">
              <ButtonBulkAction
                v-if="!assignSection"
                v-model:selected-data="selectedMembers"
                :options="bulkOptions"
                :table-name="`product-backlog-items-member-${assignSection}`"
                :total-records="totalMembers.unassigned"
              />
            </div>
            <div class="flex gap-4 mr-2">
              <ButtonSearch
                :table-name="`product-backlog-items-member-${assignSection}`"
              />
              <ButtonFilter
                :table-name="`product-backlog-items-member-${assignSection}`"
              />
            </div>
          </div>

          <FilterContainer
            :fields="
              filterFieldsMember(
                projectId,
                pbiBody?._id ?? '',
                assignSection,
                pbiBody?.category === 'Dokumentasi',
              )
            "
            :table-name="`product-backlog-items-member-${assignSection}`"
          />

          <DataTable
            :columns="tableColumns"
            :custom-column="false"
            :default-query-params="{
              assign: assignSection,
            }"
            :fetch-function="getPbiAssignedMembers"
            :options="singleAction(assignSection)"
            :selection-type="assignSection ? 'none' : 'checkbox'"
            :table-name="`product-backlog-items-member-${assignSection}`"
            @toggle-option="selectedMember = $event as AssignedMember"
            class="min-h-[70px]"
            use-paginator
          />
        </div>
      </template>

      <DialogConfirm
        v-model:visible="visibleConfirmUnassign"
        :list="selectedMember ? [selectedMember] : []"
        @confirm="assignMember(false, false)"
        confirm-label="Unassign"
        header="Unassign Member"
        list-label="nickName"
        message="Apakah kamu yakin ingin meng-unassign member dari PBI?"
        severity="danger"
      />

      <DialogConfirm
        v-model:visible="visibleConfirmTransferTask"
        :list="selectedMember ? [selectedMember] : []"
        @confirm="assignMember(false, false)"
        confirm-label="Alihkan Task"
        header="Gagal Unassign Member"
        list-label="nickName"
        severity="danger"
      >
        <template #body>
          <p>
            Member telah memiliki task selesai di PBI.<br /><br />
            Task yang tersisa dapat dialihakan ke member yang lain, apakah ingin
            melakukannya?
          </p>
        </template>
      </DialogConfirm>
    </template>
  </Dialog>
</template>
