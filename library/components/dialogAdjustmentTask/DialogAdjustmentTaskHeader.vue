<script setup lang="ts">
import { shallowRef } from 'vue';
import { dialogAddjusmentTaskBulkAction } from './options/dialogAdjustmentTaskBulkAction';
import FilterContainer from '../filtercontainer/FilterContainer.vue';
import {
  FilterField,
  FilterOptions,
} from '../filtercontainer/FilterContainer.vue.d';
import { TaskOptions } from '../dialogdetailpbi/DialogDetailPbi.vue.d';
import { MultiSelectOption } from 'lib/types/options.type';
import {
  DialogAdjustmentTaskBulkActionType,
  Task,
} from './DialogAdjustmentTask.vue.d';

import QuickFilter from '../quickfilter/QuickFilter.vue';
import TaskServices from 'lib/services/task.service';
import ButtonBulkAction from '../buttonbulkaction/ButtonBulkAction.vue';
import ButtonFilter from '../buttonfilter/ButtonFilter.vue';
import ButtonSearch from '../buttonsearch/ButtonSearch.vue';

const props = defineProps<{
  bulkActionEmitter: (
    bulkActionType: DialogAdjustmentTaskBulkActionType,
  ) => void;
  customFilterOption?: {
    taskStatus?: MultiSelectOption[];
  };
  customQueryParams?: Record<string, unknown>;
  memberKeys: number[];
}>();

const dependencyStatus: MultiSelectOption[] = [
  {
    label: 'Selesai',
    value: 'Selesai',
  },
  {
    label: 'Belum Selesai',
    value: 'Belum Selesai',
  },
  {
    label: 'Tidak Ada',
    value: 'Tidak Ada',
  },
];

const taskStatus: MultiSelectOption[] = [
  {
    label: 'Selesai',
    value: 'Selesai',
  },
  {
    label: 'Pending Review Leader',
    value: 'Pending Review Leader',
  },
  {
    label: 'Sprint',
    value: 'Sprint',
  },
  {
    label: 'Fixing Bug',
    value: 'Fixing Bug',
  },
  {
    label: 'Reported Bug',
    value: 'Reported Bug',
  },
  {
    label: 'Penyesuaian',
    value: 'Penyesuaian',
  },
  {
    label: 'Backlog',
    value: 'Backlog',
  },
  {
    label: 'Waiting for Approval',
    value: 'Waiting for Approval',
  },
];

const filterFields: FilterField[] = [
  {
    fields: ['minPriority', 'maxPriority'],
    label: 'Nilai Prioritas',
    minPlaceholder: '0',
    maxPlaceholder: '0',
    type: 'rangenumber',
  },
  {
    field: 'subModule',
    label: 'Sub Modul',
    type: 'multiselect',
    placeholder: 'Pilih sub modul',
    fetchOptionFn: async (): Promise<MultiSelectOption[]> => {
      const data = await getTaskListOption({
        subModuleOptions: true,
      });
      return data.subModuleOptions;
    },
  },
  {
    field: 'process',
    label: 'Proses',
    type: 'multiselect',
    placeholder: 'Pilih proses',
    fetchOptionFn: async (): Promise<MultiSelectOption[]> => {
      const data = await getTaskListOption({
        processOptions: true,
      });
      return data.processOptions;
    },
  },
  {
    fields: ['minTimeReportedBug', 'maxTimeReportedBug'],
    label: 'Reported Bug (Kali)',
    minPlaceholder: '0',
    maxPlaceholder: '0',
    type: 'rangenumber',
  },
  {
    field: 'lastUpdatedAt',
    label: 'Last Modified Status',
    type: 'calendar',
    placeholder: 'Pilih tanggal',
  },
  {
    field: 'dependencyStatus',
    label: 'Dependensi',
    type: 'multiselect',
    placeholder: 'Pilih dependensi status',
    fetchOptionFn: (): MultiSelectOption[] => dependencyStatus,
  },
];

const filterFieldsQuick: FilterField[] = [
  {
    field: 'project',
    type: 'multiselect',
    placeholder: 'Pilih proyek',
    fetchOptionFn: async (): Promise<MultiSelectOption[]> => {
      const data = await getTaskListOption({
        projectOptions: true,
      });
      return data.projectOptions;
    },
  },
  {
    field: 'module',
    type: 'multiselect',
    placeholder: 'Pilih modul',
    fetchOptionFn: async (): Promise<MultiSelectOption[]> => {
      const data = await getTaskListOption({
        moduleOptions: true,
      });
      return data.moduleOptions;
    },
  },
  {
    field: 'task',
    type: 'multiselect',
    placeholder: 'Pilih task',
    fetchOptionFn: async (): Promise<MultiSelectOption[]> => {
      const data = await getTaskListOption({
        taskOptions: true,
      });
      return data.taskOptions;
    },
  },
  {
    field: 'status',
    type: 'multiselect',
    placeholder: 'Pilih status',
    fetchOptionFn: (): MultiSelectOption[] =>
      props.customFilterOption.taskStatus ?? taskStatus,
  },
];

const selectedData = shallowRef<Task[]>([]);

const getTaskListOption = async (
  params: TaskOptions,
): Promise<FilterOptions<TaskOptions>> => {
  try {
    const { data } = await TaskServices.getTaskOptions({
      ...params,
      ...props.customQueryParams,
      member: JSON.stringify(props.memberKeys),
    });
    return data.data;
  } catch (error) {
    console.error(error);
  }
};
</script>
<template>
  <div class="flex justify-between items-center">
    <ButtonBulkAction
      :options="dialogAddjusmentTaskBulkAction(props?.bulkActionEmitter)"
      :selected-data="selectedData"
      table-name="dialog-adjustment-task"
    />
    <div class="flex gap-4 flex-1 justify-end">
      <ButtonSearch table-name="dialog-adjustment-task" />
      <ButtonFilter table-name="dialog-adjustment-task" />
    </div>
  </div>
  <FilterContainer
    :fields="filterFields"
    :fields-per-row="3"
    table-name="dialog-adjustment-task"
  />
  <QuickFilter
    :fields="filterFieldsQuick"
    table-name="dialog-adjustment-task"
  />
</template>
