<script setup lang="ts">
import { MenuItem } from 'lib/components/menuitem';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import DataTable from 'lib/components/datatable/DataTable.vue';
import {
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
import InputText from 'lib/components/inputtext/InputText.vue';
import ButtonSearch from 'lib/components/buttonsearch/ButtonSearch.vue';
import QuickFilter from 'lib/components/quickfilter/QuickFilter.vue';
import { fields } from '../quickfilter/helpers/fields';
import { FilterMatchMode } from 'primevue/api';
import { cloneDeep } from 'lodash';

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

const filters = ref<any>({
  'global': { value: undefined, matchMode: FilterMatchMode.CONTAINS },
  'category.key': { value: null, matchMode: FilterMatchMode.IN },
  'brand.key': { value: null, matchMode: FilterMatchMode.IN },
  'status': { value: null, matchMode: FilterMatchMode.IN },
  'assetValue': { value: null, matchMode: FilterMatchMode.BETWEEN },
});

const quickFiltering = (payload: QueryParams): void => {
  const newFilter = cloneDeep(filters.value);

  newFilter['category.key'].value = payload.category.key;
  newFilter['status'].value = payload.status;
  newFilter['brand.key'].value = payload.brand.key;
  newFilter['assetValue'].value = payload.assetValue;
  console.log('🚀 ~ quickFiltering ~ assetValue:', payload.assetValue);

  filters.value = newFilter;
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
        <ButtonSearch @search="filters.global.value = $event" />
        <ButtonDownload file-name="Download" />
        <ButtonFilter v-model:show-filter="showFilter" />
      </div>
      <QuickFilter :fields="fields" @change="quickFiltering" />

      <FilterContainer v-show="showFilter">
        <InputText label="Nama" placeholder="Tulis nama" />
      </FilterContainer>
      <DataTable
        v-model:selected-data="dataSelected"
        :columns="tableColumns"
        :data="response.data.data"
        :filters="filters"
        :options="singleAction"
        data-key="_id"
        selection-type="checkbox"
        use-option
        use-paginator
      />
    </template>
  </Card>
</template>
