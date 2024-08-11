<script setup lang="ts">
import { MenuItem } from 'lib/components/menuitem/MenuItem.vue.d';
import Card from 'wangsvue/card';
import DocTitle from '../DocTitle.vue';
import DataTable from 'wangsvue/datatable';
import {
  TableCellComponent,
  TableColumn,
} from 'lib/components/datatable/DataTable.vue.d';
import { computed, onMounted, shallowRef } from 'vue';
import Badge from 'primevue/badge';

import response from './data/response.json';

const dataSelected = shallowRef();

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
      field: 'lastModifier.fullName',
      header: 'User',
      sortable: true,
    },
  ];
});
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Table" />
    </template>
    <template #title> Rich Feature Data Table </template>
    <template #content>
      <DataTable
        v-model:selected-data="dataSelected"
        :columns="tableColumns"
        :data="response.data.data"
        :options="singleAction"
        data-key="_id"
        selection-type="checkbox"
        use-option
        use-paginator
      />
    </template>
  </Card>
</template>
