<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { MenuItem } from '../menuitem';
import QuickFilter from '../quickfilter/QuickFilter.vue';
import FilterContainer from '../filtercontainer/FilterContainer.vue';
import ButtonSearch from '../buttonsearch/ButtonSearch.vue';
import ButtonDownload from '../buttondownload/ButtonDownload.vue';
import ButtonFilter from '../buttonfilter/ButtonFilter.vue';
import eventBus from 'lib/event-bus';
import {
  FetchResponse,
  QueryParams,
  TableColumn,
} from '../datatable/DataTable.vue.d';
import { FilterMatchMode } from '../datatable/helpers/filter.helper';
import { FilterField } from '../filtercontainer/FilterContainer.vue.d';
import { MultiSelectOption } from 'lib/types/options.type';
import response from './response.json';
import DataTable from '../datatable/DataTable.vue';
import TaskServices from 'lib/services/task.service';
import { TaskTableProps } from './TaskTable.vue.d';

const props = defineProps<TaskTableProps>();

onMounted(() => {
  if (props.subTab) {
    getTasksBySubTab({});
  } else {
    getTasksByTab({});
  }
});

const singleAction: MenuItem[] = [
  {
    label: 'Button',
    icon: 'checkbox-blank-circle',
    url: '/wangsvue/button',
  },
  {
    label: 'Icon',
    icon: 'checkbox-blank-circle',
    route: '/icon',
  },
  {
    label: 'Danger Action',
    icon: 'checkbox-blank-circle',
    danger: true,
    command: (): void => {
      eventBus.emit('data-table:update', {});
    },
  },
];

const quickFilterField: FilterField[] = [
  {
    field: 'category',
    type: 'multiselect',
    placeholder: 'Pilih category',
    fetchOptionFn(): MultiSelectOption[] {
      return [
        {
          label: 'Category new',
          value: 1,
        },
      ];
    },
  },
  {
    field: 'status',
    type: 'multiselect',
    placeholder: 'Pilih Status',
    fetchOptionFn(): Promise<MultiSelectOption[]> {
      return new Promise<MultiSelectOption[]>((resolve) => {
        setTimeout(() => {
          resolve([
            { label: 'Missing', value: 'Missing' },
            { label: 'Not Paired Yet', value: 'Not Paired Yet' },
          ]);
        }, 300);
      });
    },
  },
  {
    field: 'brand',
    type: 'multiselect',
    placeholder: 'Pilih brand',
    fetchOptionFn(): Promise<MultiSelectOption[]> {
      return new Promise<MultiSelectOption[]>((resolve) => {
        setTimeout(() => {
          resolve([{ label: 'JHG-90', value: 370 }]);
        }, 300);
      });
    },
  },
  {
    fields: ['minValue', 'maxValue'],
    type: 'rangenumber',
    placeholder: '0',
    tooltip: 'Asset Value',
  },
];

const filterFields: FilterField[] = [
  {
    label: 'Caetegory',
    field: 'category',
    type: 'multiselect',
    placeholder: 'Pilih category',
    fetchOptionFn(): MultiSelectOption[] {
      return [
        {
          label: 'Category new',
          value: 1,
        },
      ];
    },
  },
  {
    label: 'Status',
    field: 'status',
    type: 'multiselect',
    placeholder: 'Pilih Status',
    fetchOptionFn(): Promise<MultiSelectOption[]> {
      return new Promise<MultiSelectOption[]>((resolve) => {
        setTimeout(() => {
          resolve([
            { label: 'Missing', value: 'Missing' },
            { label: 'Not Paired Yet', value: 'Not Paired Yet' },
          ]);
        }, 300);
      });
    },
  },
  {
    label: 'Brand/Model',
    field: 'brand',
    type: 'multiselect',
    placeholder: 'Pilih brand',
    fetchOptionFn(): Promise<MultiSelectOption[]> {
      return new Promise<MultiSelectOption[]>((resolve) => {
        setTimeout(() => {
          resolve([{ label: 'JHG-90', value: 370 }]);
        }, 300);
      });
    },
  },
  {
    label: 'Calendar',
    type: 'calendar',
    field: 'daterange',
    placeholder: 'Input Date',
  },
  {
    label: 'Asset Value',
    fields: ['minValue', 'maxValue'],
    type: 'rangenumber',
    placeholder: '0',
  },
];

const showFilter = ref(false);

const filters = ref<any>({
  'global': { value: undefined, matchMode: FilterMatchMode.CONTAINS },
  'category.key': { value: null, matchMode: FilterMatchMode.IN },
  'brand.key': { value: null, matchMode: FilterMatchMode.IN },
  'status': { value: null, matchMode: FilterMatchMode.IN },
});

const tableColumns = computed<TableColumn[]>(() => {
  return [
    {
      field: 'brand.name',
      header: 'Brand',
      sortable: true,
    },
    {
      field: 'model.name',
      header: 'Model/Type',
      sortable: true,
    },

    {
      field: 'category.name',
      header: 'Category',
      sortable: true,
    },

    {
      field: 'status',
      header: 'Status',
      sortable: true,
      fixed: true,
    },
    {
      field: 'assetValue',
      header: 'Asset Value',
      sortable: true,
      fixed: true,
    },

    {
      field: 'lastModifier.fullName',
      header: 'User',
      sortable: true,
    },
  ];
});

const getTableData = async (
  params: QueryParams,
): Promise<FetchResponse | undefined> => {
  // Simulate an asynchronous operation (even though we're returning static data)
  return new Promise((resolve) => {
    setTimeout(() => {
      const startIndex = ((params.page || 1) - 1) * (params.limit || 10); // Default limit to 10 if not provided
      const endIndex = startIndex + (params.limit || 10);

      const data =
        params.page != null && params.limit != null
          ? response.data.data.slice(startIndex, endIndex)
          : response.data.data;

      resolve({
        message: '',
        data: {
          data, // Use 'slice' for data limiting
          totalRecords: response.data.totalRecords,
        },
      });
    }, 0); // You can adjust the timeout if you need a delay
  });
};

const getTasksByTab = async (params: QueryParams): Promise<void> => {
  try {
    const { data } = await TaskServices.getTasksByTab(props.tab, params);
    console.log('🚀 ~ getTasksByTab ~ data:', data);
  } catch (error) {
    console.error(error);
  }
};

const getTasksBySubTab = async (params: QueryParams): Promise<void> => {
  try {
    const { data } = await TaskServices.getTasksBySubTab(
      props.tab,
      props.subTab,
      params,
    );
    console.log('🚀 ~ getTasksBySubTab ~ data:', data);
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div class="flex justify-end gap-4">
    <ButtonSearch @search="filters.global.value = $event" class="ml-auto" />
    <ButtonDownload file-name="Download" />
    <ButtonFilter v-model:show-filter="showFilter" />
  </div>

  <QuickFilter :fields="quickFilterField" />

  <FilterContainer v-show="showFilter" :fields="filterFields" />

  <DataTable
    :columns="tableColumns"
    :fetch-function="getTableData"
    :options="singleAction"
    :total-disabled-rows="1"
    data-key="_id"
    disable-key="isDefault"
    lazy
    use-option
    use-paginator
  />
</template>
