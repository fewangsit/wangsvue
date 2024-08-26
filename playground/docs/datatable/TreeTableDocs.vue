<script setup lang="ts">
import { MenuItem } from 'lib/components/menuitem';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import {
  FetchResponse,
  QueryParams,
  TableCellComponent,
  TableColumn,
} from 'lib/components/datatable/DataTable.vue.d';
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import Badge from 'primevue/badge';

import response from './data/treetable-response.json';
import ButtonDownload from 'lib/components/buttondownload/ButtonDownload.vue';
import ButtonFilter from 'lib/components/buttonfilter/ButtonFilter.vue';
import FilterContainer from 'lib/components/filtercontainer/FilterContainer.vue';
import ButtonSearch from 'lib/components/buttonsearch/ButtonSearch.vue';
import QuickFilter from 'lib/components/quickfilter/QuickFilter.vue';
import { filterFields, quickFilterField } from '../quickfilter/helpers/fields';
import { FilterMatchMode } from 'primevue/api';
import ButtonBulkAction from 'lib/components/buttonbulkaction/ButtonBulkAction.vue';
import eventBus from 'lib/event-bus';
import DialogConfirm from 'lib/components/dialogconfirm/DialogConfirm.vue';
import TreeTable from 'lib/components/treetable/TreeTable.vue';
import {
  TreeTableColumns,
  TreeTableProps,
} from 'lib/components/treetable/TreeTable.vue.d';
import { cloneDeep } from 'lodash';
import useLoadingStore from 'lib/components/loading/store/loading.store';
import Checkbox from 'lib/components/checkbox/Checkbox.vue';
import Dropdown from 'lib/components/dropdown/Dropdown.vue';

const dataSelected = shallowRef();
const actionData = ref();
const showFilter = shallowRef(false);
const showDialog = shallowRef(false);
const usePaginator = shallowRef(true);
const useOption = shallowRef(true);
const selectionType = shallowRef('Checkbox');
const customColumn = shallowRef(true);
const tableKey = shallowRef(0);
const noRecord = shallowRef(false);
const treetable = shallowRef(true);
const singleSelection = shallowRef();
const { setLoading } = useLoadingStore();

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

onMounted(() => {
  setLoading(true, 'Memuat');
  setTimeout(() => {
    showGroup.value = true;
    setLoading(false);
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

const childrenColumns = computed(() => {
  const columns: TreeTableColumns[] = cloneDeep(tableColumns.value);
  columns.splice(1, 1);
  columns[0].colspan = 2;

  columns.splice(4, 1);
  columns[3].colspan = 2;

  return columns;
});

const getTableData = async (
  params: QueryParams,
): Promise<FetchResponse | undefined> => {
  // eslint-disable-next-line no-console
  console.log('🚀 ~ params:', params);
  // Simulate an asynchronous operation (even though we're returning static data)
  return new Promise((resolve) => {
    setTimeout(
      () => {
        const startIndex = ((params.page || 1) - 1) * (params.limit || 10); // Default limit to 10 if not provided
        const endIndex = startIndex + (params.limit || 10);

        const data =
          params.page != null && params.limit != null
            ? response.data.data.slice(startIndex, endIndex)
            : response.data.data;

        resolve({
          message: '',
          data: {
            data: noRecord.value ? [] : data, // Use 'slice' for data limiting
            totalRecords: noRecord.value ? 0 : response.data.totalRecords,
          },
        });
      },
      params.page === 1 || params.sortBy ? 2000 : 1000,
    ); // You can adjust the timeout if you need a delay
  });
};

watch(usePaginator, () => {
  tableKey.value++;
});

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
      <DocTitle :name="treetable ? 'Tree Table' : 'Data Table'" />
    </template>
    <template #title>
      Rich Feature {{ treetable ? 'Tree Table' : 'Data Table' }}
    </template>
    <template #content>
      <Checkbox v-model="treetable" label="Tree Table" />
      <Checkbox v-model="usePaginator" label="Use Pagination" />
      <Checkbox v-model="customColumn" label="Use Column Visibility" />
      <Checkbox v-model="useOption" label="Use Single Action" />
      <Checkbox
        v-model="noRecord"
        @update:model-value="tableKey++"
        label="Check this box to make the table has no record found"
      />

      <Dropdown
        v-model="selectionType"
        :options="['Checkbox', 'Single', 'None']"
        class="max-w-40"
        label="Selection Type"
      />

      <span v-if="selectionType === 'Single'">
        Your Selection: {{ singleSelection }}
      </span>
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

      <FilterContainer v-show="showFilter" :fields="filterFields" />
      <QuickFilter :fields="quickFilterField" />

      <TreeTable
        :key="tableKey"
        v-model:single-selection="singleSelection"
        :child-table-props="{ columns: childrenColumns }"
        :columns="tableColumns"
        :custom-column="customColumn"
        :fetch-function="getTableData"
        :options="singleAction"
        :selection-type="
          selectionType.toLowerCase() as TreeTableProps['selectionType']
        "
        :total-disabled-rows="1"
        :tree-table="treetable"
        :use-option="useOption"
        :use-paginator="usePaginator"
        @toggle-option="console.log"
        @update:single-selection="console.log"
        data-key="_id"
        lazy
      />

      <DialogConfirm
        v-model:visible="showDialog"
        @hide="console.log(actionData)"
        header="Header"
        severity="danger"
      />
    </template>
  </Card>
</template>
