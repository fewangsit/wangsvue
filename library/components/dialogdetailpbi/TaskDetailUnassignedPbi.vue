<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import taskQuickFilterFields from './options/taskQuickFilterFields';
import { getImageURL, useToast } from 'lib/utils';
import {
  TableCellComponent,
  QueryParams,
  FetchResponse,
  TableColumn,
} from '../datatable/DataTable.vue.d';
import { AssignedMember, Pbi } from './DialogDetailPbi.vue.d';
import { TaskTableItem } from 'lib/types/task.type';
import UserName from '../username/UserName.vue';
import Dialog from '../dialog/Dialog.vue';
import QuickFilter from '../quickfilter/QuickFilter.vue';
import DataTable from '../datatable/DataTable.vue';
import Button from '../button/Button.vue';
import ButtonSearch from '../buttonsearch/ButtonSearch.vue';
import eventBus from 'lib/event-bus';
import { SprintServices, TaskServices } from 'wangsit-api-services';

const toast = useToast();

const props = defineProps<{
  selectedPbi?: Pbi;
  assignedMembers?: AssignedMember[];
}>();

const projectId = sessionStorage.getItem('projectId') as string;

const defaultUnassignedQuery = computed<Record<string, string>>(() => {
  /*
   * Find tasks that aren't assigned to any members (null)
   * or assigned to members in the assigned members list
   */
  const assignedMemberKeys = props.assignedMembers
    ?.map((member) => `, ${member.key}`)
    .join('');
  return {
    project: `["${projectId}"]`,
    excludePbi: `["${props.selectedPbi?._id}"]`,
    status: '["Backlog"]',
    member: `[null${assignedMemberKeys}]`,
  };
});

const taskColumns: TableColumn[] = [
  {
    field: 'module.initial',
    header: 'Modul',
    fixed: true,
    sortable: true,
  },
  {
    field: 'subModule.name',
    header: 'Sub Modul',
    fixed: true,
    sortable: true,
  },
  {
    field: 'process.name',
    header: 'Proses',
    fixed: true,
    sortable: true,
  },
  {
    field: 'name',
    header: 'Task',
    fixed: true,
    sortable: true,
  },
  {
    field: 'team',
    header: 'Team',
    sortable: true,
    bodyTemplate: (data: TaskTableItem): string =>
      data.team.map((t) => t).join(', '),
  },
  {
    field: 'assignedTo.0',
    header: 'Assign',
    fixed: true,
    sortable: true,
    bodyComponent: (data: TaskTableItem): TableCellComponent => {
      return {
        component: UserName,
        props: {
          user: {
            ...data.assignedTo[0],
            profilePicture: getImageURL(data.assignedTo[0]?.profilePictureBig),
          },
          emptyable: true,
        },
      };
    },
  },
];

const visible = defineModel<boolean>('visible', { required: true });
const selectedTasks = shallowRef<TaskTableItem[]>();

const getPbiTasks = async (
  query: QueryParams,
): Promise<FetchResponse<TaskTableItem> | undefined> => {
  try {
    const { data } = await TaskServices.getTasks(query);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const addPbiTasks = async (): Promise<void> => {
  try {
    await SprintServices.addPbiTasks(
      projectId,
      props.selectedPbi?._id as string,
      { taskIds: selectedTasks.value?.map((task) => task._id) },
    );

    eventBus.emit('data-table:update', {
      tableName: 'all',
    });
    visible.value = false;
    toast.add({
      severity: 'success',
      message: 'Task telah ditambahkan.',
    });
  } catch (error) {
    console.error(error);
    toast.add({
      error,
      message: 'Task gagal ditambahkan.',
    });
  }
};
</script>

<template>
  <Dialog
    v-model:visible="visible"
    class="w-[800px]"
    content-class="justify-end"
    header="Ambil Task"
  >
    <template #default>
      <ButtonSearch
        class="place-self-end"
        table-name="list-unassigned-task-table"
      />
      <QuickFilter
        :fields="taskQuickFilterFields(projectId, selectedPbi?._id)"
        table-name="list-unassigned-task-table"
      />
      <DataTable
        v-model:selected-data="selectedTasks"
        :columns="taskColumns"
        :custom-column="false"
        :default-query-params="defaultUnassignedQuery"
        :fetch-function="getPbiTasks"
        :use-option="false"
        lazy
        selection-type="checkbox"
        table-name="list-unassigned-task-table"
        use-paginator
      />
    </template>
    <template #footer>
      <div class="justify-end gap-2 flex-col">
        <Button
          @click="visible = false"
          label="Batal"
          severity="secondary"
          text
        />
        <Button @click="addPbiTasks" label="Ambil" severity="success" />
      </div>
    </template>
  </Dialog>
</template>
