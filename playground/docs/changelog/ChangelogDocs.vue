<script setup lang="ts">
import Changelog from 'lib/components/changelog/Changelog.vue';
import { ChangelogType } from 'lib/components/changelogpage/ChangelogPage.vue.d';

const additionalTemplateColumns = [
  {
    index: 2,
    column: {
      field: 'createdAtt',
      header: 'Tanggal lewat template column',
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
      header: 'Tanggal index ke 5 (kolom ke 6)',
      visible: true,
      reorderable: false,
      bodyTemplate: (data: ChangelogType): string => {
        return data.createdAt ?? '-';
      },
    },
  },
];

const additionalTemplateFilters = [
  {
    index: 3,
    filter: {
      label: 'Custom Filter Aksi',
      type: 'multiselect',
      field: 'action',
      options: 'actionOptions',
    },
  },
];
</script>

<template>
  <div class="flex flex-col">
    <span>Normal Changelog</span>
    <Changelog
      header="Changelog: coding > testing"
      object="Tim"
      object-name-column="Custom Column Name"
      table-name="normal-changelog"
    />

    <span>Changelog dengan additional template columns dan filters</span>
    <Changelog
      :additional-template-columns="additionalTemplateColumns"
      :additional-template-filters="additionalTemplateFilters"
      header="Changelog: dengan additional template columns dan filters"
      object="Tim"
      table-name="additonal-template-changelog"
    />
  </div>
</template>
