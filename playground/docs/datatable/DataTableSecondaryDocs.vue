<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DataTable from 'lib/components/datatable/DataTable.vue';
import {
  QueryParams,
  TableCellComponent,
  TableColumn,
  MultiRowAttribute,
} from 'lib/components/datatable/DataTable.vue.d';
import { MenuItem } from 'lib/components/menuitem';
import { computed, onMounted, ref, shallowRef } from 'vue';
import DocTitle from '../DocTitle.vue';

import Badge from 'lib/components/badge/Badge.vue';
import ButtonBulkAction from 'lib/components/buttonbulkaction/ButtonBulkAction.vue';
import ButtonDownload from 'lib/components/buttondownload/ButtonDownload.vue';
import ButtonFilter from 'lib/components/buttonfilter/ButtonFilter.vue';
import ButtonSearch from 'lib/components/buttonsearch/ButtonSearch.vue';
import DialogConfirm from 'lib/components/dialogconfirm/DialogConfirm.vue';
import FilterContainer from 'lib/components/filtercontainer/FilterContainer.vue';
import QuickFilter from 'lib/components/quickfilter/QuickFilter.vue';
import eventBus from 'lib/event-bus';
import { FilterMatchMode } from 'primevue/api';
import { filterFields, quickFilterField } from '../quickfilter/helpers/fields';
import response from './data/pipelineResponse.json';

type PipelineResponse = {
  message: string;
  status: number;
  data: {
    totalRecords: number;
    data: Pipeline[];
  };
};

type Pipeline = {
  _id: string;
  accountManager: {
    _id: string;
    nickName: string;
  };
  name: string;
  partner: {
    _id: string;
    name: string;
  };
  status: string;
  products: Product[];
  estimatedValue: number;
  estimatedClose: string;
  currentPurchaseSituation: string;
  lastUpdateCps: string;
  nextAction: string;
  isItEverOverdue: boolean;
  updatedAt: string;
};

type Product = {
  _id: string;
  name: string;
  sku: string;
  purchaseType: string;
  quantity: number;
  duration: string;
  standardPrice: number;
};

const dataSelected = shallowRef();
const actionData = ref();
const showFilter = shallowRef(false);
const showDialog = shallowRef(false);

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
  setTimeout(() => {
    showGroup.value = true;
  }, 3000);
});

const showGroup = shallowRef<boolean>(false);

const tableColumns = computed<TableColumn[]>(() => {
  return [
    {
      field: 'accountManager.nickName',
      header: 'Account Manager',
      sortable: true,
      reorderable: false,
      fixed: true,
    },
    {
      field: 'name',
      header: 'Pipeline',
      sortable: true,
      fixed: true,
    },
    {
      field: 'partner.name',
      header: 'Partner/Distributor',
      sortable: true,
    },
    {
      field: 'status',
      header: 'Status Pipeline',
      sortable: true,
      bodyComponent: (data: Pipeline): TableCellComponent => {
        return {
          component: Badge,
          props: {
            label: data.status,
            severity: 'success',
            format: 'nowrap',
          },
        };
      },
    },
    {
      field: 'product',
      header: 'Produk',
      sortable: true,
      preset: {
        type: 'multirow',
        fieldAttributes: (data: Pipeline): MultiRowAttribute[] => {
          return data.products.map((each) => {
            return {
              value: each.name,
            };
          });
        },
      },
    },
    {
      field: 'sku',
      header: 'SKU',
      sortable: true,
      preset: {
        type: 'multirow',
        fieldAttributes: (data: Pipeline): MultiRowAttribute[] => {
          return data.products.map((each) => {
            return {
              value: each.quantity,
              class:
                each.quantity > 13 ? 'text-success-500' : 'text-danger-500',
            };
          });
        },
      },
    },
    {
      field: 'estimatedValue',
      header: 'Estimasi Nilai Pipeline',
      sortable: true,
    },
    {
      field: 'estimatedClose',
      header: 'Estimasi Close',
      sortable: true,
      fixed: true,
    },
    {
      field: 'currentPurchaseSituation',
      header: 'Current Purchase Situation',
      sortable: true,
      fixed: true,
    },
    {
      field: 'lastUpdateCps',
      header: 'Last Update CPS',
      sortable: true,
    },
    {
      field: 'nextAction',
      header: 'Next Action',
      sortable: true,
    },
    {
      field: 'updatedAt',
      header: 'Last Update',
      sortable: true,
    },
  ];
});

const getTableData = async (
  params: QueryParams,
): Promise<PipelineResponse | undefined> => {
  // Simulate an asynchronous operation (even though we're returning static data)
  return new Promise((resolve) => {
    setTimeout(() => {
      const startIndex = ((params.page || 1) - 1) * (params.limit || 10); // Default limit to 10 if not provided
      const endIndex = startIndex + (params.limit || 10);

      const data: Pipeline[] =
        params.page != null && params.limit != null
          ? response.data.data.slice(startIndex, endIndex)
          : response.data.data;

      resolve({
        message: '',
        status: 200,
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

const setSingleActionClass = (data: Pipeline): string | string[] => {
  return data.isItEverOverdue ? '!bg-warning-200' : '';
};
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
        :set-single-action-class="setSingleActionClass"
        :total-disabled-rows="1"
        data-key="_id"
        highlight-key="isItEverOverdue"
        lazy
        selection-type="single"
        use-option
        use-paginator
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
