<script setup lang="ts">
import { dialogAddjusmentTaskBulkAction } from './options/dialogAdjustmentTaskBulkAction';
import FilterContainer from '../filtercontainer/FilterContainer.vue';
import {
  FilterField,
  FilterOptions,
} from '../filtercontainer/FilterContainer.vue.d';
import { TaskOptions } from '../dialogdetailpbi/DialogDetailPbi.vue.d';
import { MultiSelectOption } from 'lib/types/options.type';
import { DialogAdjustmentTaskBulkActionType } from './DialogAdjustmentTask.vue.d';

import QuickFilter from '../quickfilter/QuickFilter.vue';
import TaskServices from 'lib/services/task.service';
import ButtonBulkAction from '../buttonbulkaction/ButtonBulkAction.vue';
import ButtonFilter from '../buttonfilter/ButtonFilter.vue';
import ButtonSearch from '../buttonsearch/ButtonSearch.vue';

const props = defineProps<{
  bulkActionEmitter: (
    bulkActionType: DialogAdjustmentTaskBulkActionType,
  ) => void;
  memberIds: string[];
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
    label: 'Penyesuaian',
    value: 'Penyesuaian',
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
    label: 'Pending Review Leader',
    value: 'Pending Review Leader',
  },
  {
    label: 'Sprint',
    value: 'Sprint',
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
    fetchOptionFn: (): MultiSelectOption[] => taskStatus,
  },
];

const getTaskListOption = async (
  params: TaskOptions,
): Promise<FilterOptions<TaskOptions>> => {
  try {
    const { data } = await TaskServices.getTaskOptions({
      ...params,
      member: JSON.stringify(props.memberIds),
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
      table-name="dialog-addjustment-task"
    />
    <div class="flex gap-4 flex-1 justify-end">
      <ButtonSearch table-name="dialog-addjustment-task" />
      <ButtonFilter table-name="dialog-addjustment-task" />
    </div>
  </div>
  <FilterContainer
    :fields="filterFields"
    :fields-per-row="3"
    table-name="dialog-addjustment-task"
  />
  <QuickFilter
    :fields="filterFieldsQuick"
    table-name="dialog-addjustment-task"
  />
</template>
