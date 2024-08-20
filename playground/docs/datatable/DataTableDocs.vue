<script setup lang="ts">
import { MenuItem } from 'lib/components/menuitem';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import DataTable from 'lib/components/datatable/DataTable.vue';
import {
  FetchResponse,
  QueryParams,
  TableCellComponent,
  TableColumn,
} from 'lib/components/datatable/DataTable.vue.d';
import { computed, onMounted, ref, shallowRef } from 'vue';
import Badge from 'primevue/badge';

import response from './data/response.json';
import ButtonDownload from 'lib/components/buttondownload/ButtonDownload.vue';
import ButtonFilter from 'lib/components/buttonfilter/ButtonFilter.vue';
import FilterContainer from 'lib/components/filtercontainer/FilterContainer.vue';
import ButtonSearch from 'lib/components/buttonsearch/ButtonSearch.vue';
import QuickFilter from 'lib/components/quickfilter/QuickFilter.vue';
import { filterFields, quickFilterField } from '../quickfilter/helpers/fields';
import { FilterMatchMode } from 'primevue/api';
import ButtonBulkAction from 'lib/components/buttonbulkaction/ButtonBulkAction.vue';
import eventBus from 'lib/event-bus';

const dataSelected = shallowRef();
const showFilter = shallowRef(false);

const singleAction: MenuItem[] = [
  {
    label: 'Action',
    icon: 'checkbox-blank-circle',
  },
  {
    label: 'Action',
    icon: 'checkbox-blank-circle',
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

onMounted(() => {
  setTimeout(() => {
    showGroup.value = true;
  }, 3000);
});

const showGroup = shallowRef<boolean>(false);

const tableColumns = computed<TableColumn[]>(() => {
  return [
    {
      field: 'name.nameWithSequence',
      header: 'Asset Name',
      sortable: true,
      reorderable: false,
      fixed: true,
      bodyClass: 'text-primary',
      bodyComponent: (data: any): TableCellComponent => {
        return {
          component: Badge,
          props: {
            value: data.name.nameWithSequence,
          },
        };
      },
    },

    {
      field: 'group.name',
      header: 'Group',
      sortable: true,
      visible: showGroup.value,
      fixed: true,
    },

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

const filters = ref<any>({
  'global': { value: undefined, matchMode: FilterMatchMode.CONTAINS },
  'category.key': { value: null, matchMode: FilterMatchMode.IN },
  'brand.key': { value: null, matchMode: FilterMatchMode.IN },
  'status': { value: null, matchMode: FilterMatchMode.IN },
  'assetValue': { value: null, matchMode: FilterMatchMode.BETWEEN },
});
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Table" />
    </template>
    <template #title> Rich Feature Data Table </template>
    <template #content>
      <div class="flex justify-end gap-4">
        <ButtonBulkAction
          v-model:selected-data="dataSelected"
          :options="singleAction"
          show-select-all-button
        />
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
  </Card>
</template>
