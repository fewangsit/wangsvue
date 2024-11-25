<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue';
import ButtonSearch from '../buttonsearch/ButtonSearch.vue';
import DataTable from '../datatable/DataTable.vue';
import {
  FetchResponse,
  QueryParams,
  TableColumn,
} from '../datatable/DataTable.vue.d';
import { SprintSummary } from './DetailSprint.vue.d';
import SprintServices from 'lib/services/sprint.service';

const props = defineProps<{
  sprintId: string | undefined;
}>();

onMounted(async () => {
  showTable.value = false;
  const tableData = await getSprintSummary({});
  if (tableData) setUserColumns(tableData);
});

const projectId = sessionStorage.getItem('projectId') as string;

const baseColumns: TableColumn[] = [
  {
    header: 'Tanggal',
    field: 'date',
    sortable: true,
  },
  {
    header: 'Sisa Task',
    field: 'remainingTasks',
    sortable: true,
  },
  {
    header: 'Task Selesai',
    field: 'finishedTasks',
    sortable: true,
  },
];

const userColumns = shallowRef<TableColumn[]>([]);
const showTable = shallowRef<boolean>();

const columns = computed<TableColumn[]>(() => {
  return [...baseColumns, ...userColumns.value];
});

const getSprintSummary = async (
  query: QueryParams,
): Promise<FetchResponse<SprintSummary> | undefined> => {
  try {
    const { data } = await SprintServices.getSprintSummary(
      query,
      projectId,
      props.sprintId,
    );

    return data;
  } catch (error) {
    console.error(error);
  }
};

const setUserColumns = async (
  tableData: FetchResponse<SprintSummary>,
): Promise<void> => {
  userColumns.value = tableData.data.data[0].membersDetails.map(
    (member, index) => ({
      header: member.nickName,
      field: `membersDetails[${index}].taskProgress`,
      bodyTemplate: (summaryItem: SprintSummary): string => {
        return summaryItem.membersDetails[index].taskProgress;
      },
    }),
  );
  showTable.value = true;
};
</script>

<template>
  <template v-if="showTable">
    <ButtonSearch class="place-self-end" table-name="sprint-summary" />
    <DataTable
      :columns="columns"
      :custom-column="false"
      :fetch-function="getSprintSummary"
      :use-option="false"
      lazy
      selection-type="none"
      table-name="sprint-summary"
      use-paginator
    />
  </template>
</template>
