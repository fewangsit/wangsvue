<script setup lang="ts">
import Changelog from 'lib/components/changelog/Changelog.vue';
import {
  ChangelogTemplateColumn,
  ChangelogTemplateFilter,
} from 'lib/components/changelog/Changelog.vue.d';
import { ChangelogType } from 'lib/components/changelogpage/ChangelogPage.vue.d';
import {
  TableCellComponent,
  TableColumn,
} from 'lib/components/datatable/DataTable.vue.d';
import MultiSelect from 'lib/components/multiselect/MultiSelect.vue';
import DataTable from 'lib/components/datatable/DataTable.vue';
import { computed, h, ref } from 'vue';

const options = {
  removedColumns: [
    { label: 'Tanggal', value: 'createdAt' },
    { label: 'Aksi', value: 'action' },
    { label: 'Nama Objek', value: 'objectName' },
    { label: 'Field', value: 'field' },
    { label: 'Data Lama', value: 'oldValue' },
    { label: 'Data Baru', value: 'newValue' },
    { label: 'Diubah Oleh', value: 'modifiedBy' },
  ],
  removedFilters: [
    { label: 'Tanggal', value: 'createdAt' },
    { label: 'Aksi', value: 'action' },
    { label: 'Name Objek', value: 'objectName' },
    { label: 'Field', value: 'field' },
    { label: 'Diubah Oleh', value: 'modifiedBy' },
  ],
};

const featureColumns: TableColumn[] = [
  {
    field: 'status',
    header: 'Status',
    class: '!w-[60px] !max-w-[60px]',
    preset: {
      type: 'toggle',
      onToggle: (e: boolean, data): void => {
        data.status = e;
      },
    },
  },
  {
    field: 'name',
    header: 'Feature Name',
    class: '!w-[150px] !max-w-[150px]',
    bodyTemplate: (data): string => data.name,
  },
  {
    field: 'value',
    header: 'Value',
    bodyComponent: (data): TableCellComponent => {
      if (/additional/.test(data.field)) {
        if (/Columns/.test(data.field)) {
          return {
            component: h(
              'span',
              'Tanggal lewat template column (index 2) & Tanggalan tambahan (index 5)',
            ),
          };
        }
        return { component: h('span', 'Custom Filter Aksi') };
      }

      return {
        component: MultiSelect,
        model: data.value,
        props: {
          useValidator: true,
          options: options[data.field as keyof typeof options],
          fieldName: data.field,
          optionLabel: 'label',
          optionValue: 'value',
        },
        events: {
          'update:modelValue': (e: string[]): void => {
            data.value = e;
          },
        },
      };
    },
  },
];

const additionalTemplateColumns: ChangelogTemplateColumn[] = [
  {
    index: 2,
    column: {
      field: 'createdAtt',
      header: 'Tanggal lewat template column (index 2)',
      sortable: true,
      visible: true,
      fixed: true,
      bodyTemplate: (data: ChangelogType): string => {
        return data.createdAt ?? '-';
      },
    },
  },
  {
    index: 5,
    column: {
      field: 'createdAttt',
      header: 'Tanggalan tambahan (index 5)',
      visible: true,
      reorderable: false,
      bodyTemplate: (data: ChangelogType): string => {
        return data.createdAt ?? '-';
      },
    },
  },
];

const additionalTemplateFilters: ChangelogTemplateFilter[] = [
  {
    index: 3,
    filter: {
      label: 'Custom Filter Aksi',
      type: 'multiselect',
      field: 'action',
    },
  },
];

const featureData = ref([
  {
    name: 'Removed columns',
    field: 'removedColumns',
    status: false,
    value: [],
  },
  {
    name: 'Removed filter fields',
    field: 'removedFilters',
    status: false,
    value: [],
  },
  {
    name: 'Additional columns',
    field: 'additionalColumns',
    status: false,
  },
  {
    name: 'Additional filter fields',
    field: 'additionalFilters',
    status: false,
  },
]);

const featuredTableName = computed<string>(() => {
  const additionalColumns = featureData.value[2].status ? 'addcolumns' : '';
  const additionalFilters = featureData.value[2].status ? 'addfilters' : '';
  const removedColumns = featureData.value[2].status ? 'removecolumns' : '';
  const removedFilters = featureData.value[2].status ? 'removefilters' : '';

  return `${additionalColumns}-${additionalFilters}-${removedColumns}-${removedFilters}-template-changelog`;
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-1">
        <span>Switch to activate/deactivate custom features</span>
        <DataTable
          :columns="featureColumns"
          :custom-column="false"
          :data="featureData"
          :use-option="false"
          data-key="name"
          lazy
          selection-type="none"
        />
      </div>
      <span>Changelog dengan custom features</span>
      <Changelog
        :additional-template-columns="
          featureData[2].status ? additionalTemplateColumns : undefined
        "
        :additional-template-filters="
          featureData[3].status ? additionalTemplateFilters : undefined
        "
        :removed-columns="featureData[0].status ? featureData[0].value : []"
        :removed-filters="featureData[1].status ? featureData[1].value : []"
        :table-name="featuredTableName"
        header="Changelog: dengan custom features"
        object="Tim"
      />
    </div>
    <div class="flex flex-col gap-1">
      <span>Normal Changelog</span>
      <Changelog
        header="Changelog: coding > testing"
        object="Tim"
        table-name="normal-changelog"
      />
    </div>
  </div>
</template>
