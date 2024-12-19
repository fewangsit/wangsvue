<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import {
  FetchResponse,
  QueryParams,
  TableCellComponent,
  TableColumn,
} from '../datatable/DataTable.vue.d';
import { Pbi } from '../dialogdetailpbi/DialogDetailPbi.vue.d';
import { MenuItem } from '../menuitem';
import { SprintDetail } from './DetailSprint.vue.d';
import { useRoute } from 'vue-router';
import Dialog from '../dialog/Dialog.vue';
import QuickFilter from '../quickfilter/QuickFilter.vue';
import DataTable from '../datatable/DataTable.vue';
import Button from '../button/Button.vue';
import ButtonBulkAction from '../buttonbulkaction/ButtonBulkAction.vue';
import ButtonSearch from '../buttonsearch/ButtonSearch.vue';
import DialogDetailPbi from '../dialogdetailpbi/DialogDetailPbi.vue';
import { SprintServices } from 'wangsit-api-services';
import quickFilterFields from './options/quickFilterFields';
import Badge from '../badge/Badge.vue';
import eventBus from 'lib/event-bus';

const route = useRoute();

const props = defineProps<{
  selectedSprint?: SprintDetail;
}>();

const emit = defineEmits<{
  add: [void];
}>();

const projectId = sessionStorage.getItem('projectId') as string;

const columns: TableColumn[] = [
  {
    header: 'Product Backlog Item',
    field: 'name',
    sortable: true,
    fixed: true,
  },
  {
    header: 'Kategori',
    field: 'category',
    sortable: true,
    fixed: true,
  },
  {
    header: 'Status',
    field: 'status',
    sortable: true,
    fixed: true,
    bodyComponent: (data: Pbi): TableCellComponent => {
      return {
        component: Badge,
        props: {
          label: data.status,
          format: 'nowrap',
        },
      };
    },
  },
  {
    header: 'Jumlah Task',
    field: 'totalTask',
    sortable: true,
  },
  {
    header: 'Estimasi Pengerjaan',
    field: 'estimateDuration',
    sortable: true,
    bodyTemplate: (data: Pbi): string => {
      return data.estimateDuration === '00h 00j 00m'
        ? '-'
        : (data.estimateDuration ?? '-');
    },
  },
  {
    header: 'Iterasi',
    field: 'iteration',
    sortable: true,
    bodyTemplate: (data: Pbi): string => {
      return data.iteration ? `${data.iteration} Kali` : '-';
    },
  },
];

const visible = defineModel<boolean>('visible', { required: true });
const visibleDialogDetail = shallowRef<boolean>(false);
const selectedPbis = shallowRef<Pbi[]>([]);
const selectedPbi = shallowRef<Pbi>();

const singleAction = computed<MenuItem[]>(() => [
  {
    label: 'Detail PBI',
    icon: 'file-copy-2-line',
    command: (): void => {
      visibleDialogDetail.value = true;
    },
  },
]);

const getPbis = async (
  query: QueryParams,
): Promise<FetchResponse<Pbi> | undefined> => {
  try {
    query.isInActiveSprint = false;
    if (!query.status) query.status = '["Backlog", "Overdue", "Reported Bug"]';

    const { data } = await SprintServices.getListPbis(projectId, query);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const addPbis = async (): Promise<void> => {
  try {
    await SprintServices.addSprintPbis(
      projectId,
      props.selectedSprint?._id ?? '',
      { pbiIds: selectedPbis.value.map((pbi) => pbi._id) },
    );

    eventBus.emit('data-table:clear-selected-data', {
      tableName: 'list-pbi-table-unassigned',
    });
    emit('add');
    visible.value = false;
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <Dialog
    v-model:visible="visible"
    class="w-[800px]"
    content-class="justify-end"
    header="Product Backlog Item"
  >
    <template #default>
      <span>
        Pilih product backlog item yang akan dikerjakan pada
        <span class="font-semibold">
          Sprint {{ selectedSprint?.sprintNumber }}
        </span>
      </span>
      <div class="flex justify-between">
        <div class="content-center">
          <ButtonBulkAction
            v-model:selected-data="selectedPbis"
            :options="[]"
            table-name="list-pbi-table-unassigned"
          />
        </div>
        <div class="flex gap-4">
          <ButtonSearch table-name="list-pbi-table-unassigned" />
        </div>
      </div>
      <QuickFilter
        :fields="quickFilterFields(projectId, route.name as string)"
        table-name="list-pbi-table-unassigned"
      />
      <DataTable
        :columns="columns"
        :fetch-function="getPbis"
        :options="singleAction"
        @toggle-option="selectedPbi = $event"
        lazy
        selection-type="checkbox"
        table-name="list-pbi-table-unassigned"
        use-paginator
      />
      <DialogDetailPbi
        v-model:visible="visibleDialogDetail"
        :selected-pbi="selectedPbi"
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
        <Button @click="addPbis" label="Simpan" severity="success" />
      </div>
    </template>
  </Dialog>
</template>
