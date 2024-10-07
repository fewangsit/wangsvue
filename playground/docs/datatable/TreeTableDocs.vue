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
import Changelog from 'lib/components/changelog/Changelog.vue';
import UserName from 'lib/components/username/UserName.vue';

const dataSelected = shallowRef();
const actionData = ref();
const showDialog = shallowRef(false);
const usePaginator = shallowRef(true);
const useOption = shallowRef(true);
const selectionType = shallowRef('Checkbox');
const customColumn = shallowRef(true);
const tableKey = shallowRef(0);
const noRecord = shallowRef(false);
const treetable = shallowRef(true);
const reorderable = shallowRef(true);
const scrollHeight = shallowRef(true);
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
  }, 1000);
});

const showGroup = shallowRef<boolean>(false);

const tableColumns = computed<TableColumn[]>(() => {
  return [
    {
      field: 'isActive',
      header: 'Group',
      sortable: true,
      preset: {
        type: 'toggle',
        confirmDialogProps: {
          header: 'Are you sure?',
          listLabel: 'name.nameWithSequence',
          message: 'This action will set this data to innactive. Are you sure?',
          severity: 'danger',
          confirmLabel: 'Yes, sure!',
          showWhen: async (data): Promise<boolean> => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(!data.isActive);
              }, 2000);
            });
          },
        },
        onConfirm: (state, data, revert): void => {
          setTimeout(() => {
            revert();
          }, 1000);
        },
      },
    },

    {
      field: 'name',
      header: 'This Header will make the page overflows',
      sortable: true,
      reorderable: true,
      fixed: false,
      bodyClass: '!py-0.5 !text-danger-500',
      bodyComponent: (data: any): TableCellComponent => {
        return {
          component: UserName,
          props: {
            userNameField: 'name.nameWithSequence',
            user: {
              name: {
                nameWithSequence: data.name.nameWithSequence,
              },
              profilePicture:
                'https://fastly.picsum.photos/id/643/500/500.jpg?hmac=WKnFpxUsXkNv_FNZmgh2ALm7Kd2z3vg0RtJeDxExpJQ',
            },
          },
        };
      },
    },
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
      editable: true,
    },

    {
      field: 'lastModifier.fullName',
      header: 'User',
      editable: true,
    },
  ];
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const childrenColumns = computed(() => {
  const columns: TreeTableColumns[] = cloneDeep(tableColumns.value);
  columns.splice(1, 1);
  columns[0].colspan = 2;

  columns.splice(4, 1);
  columns[3].colspan = 2;

  return columns;
});

const subColumns: TreeTableColumns[] = [
  {
    field: 'bugDetail',
    header: 'Bug Detail',
    parentColumnsFields: ['group'],
    fixed: true,
  },
  {
    field: 'actualResult',
    header: 'Actual Result',
    parentColumnsFields: ['name', 'name.nameWithSequence'],
    fixed: true,
  },
  {
    field: 'testSteps',
    header: 'Test Steps',
    parentColumnsFields: ['group.name', 'brand.name'],
    colspan: 7,
    fixed: true,
  },
];

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
      <Checkbox v-model="reorderable" label="Reorderable" />
      <Checkbox v-model="scrollHeight" label="Scrollable" />
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
        <ButtonFilter />
        <Changelog object="groupMember" />
      </div>

      <FilterContainer :fields="filterFields" @apply="console.log" />
      <QuickFilter :fields="quickFilterField" />

      <TreeTable
        :key="tableKey"
        v-model:single-selection="singleSelection"
        :child-table-props="{ columns: subColumns, useColumnsHeader: true }"
        :columns="tableColumns"
        :custom-column="customColumn"
        :fetch-function="getTableData"
        :options="singleAction"
        :reorderable="reorderable"
        :scroll-height="scrollHeight ? '50vh' : undefined"
        :selection-type="
          selectionType.toLowerCase() as TreeTableProps['selectionType']
        "
        :total-disabled-rows="1"
        :tree-table="treetable"
        :use-option="useOption"
        :use-paginator="usePaginator"
        @input="console.log($event)"
        @row-reorder="console.log($event)"
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
