<script lang="ts" setup>
import eventBus, { Events } from 'lib/event-bus';
import { exportToExcel } from 'lib/utils';
import { ITable } from 'lib/utils/exportToExcel.util';
import { computed, inject, ref } from 'vue';
import Icon from '../icon/Icon.vue';
import type { ButtonDownloadProps } from './ButtonDownload.vue.d';

const props = withDefaults(defineProps<ButtonDownloadProps>(), {
  tableName: 'datatable',
  multiTableNames: undefined,
  additionalTextBelowTable: undefined,
});

const Preset = inject<Record<string, any>>('preset', {}).buttondownload;

const tables = ref<Record<string, ITable>>({});

/**
 * To make sure the same tablename not re-inserted to `tables` that'll be exported
 */
const usedTableNames = computed<string[]>(() => {
  return Object.entries(tables.value).map(([field]) => {
    return field;
  });
});

const downloadExcel = (): void => {
  const { fileName, tableName, multiTableNames } = props;

  if (multiTableNames?.length) {
    // Add listener to download multi tables only when `props.multiTableNames` is defined
    eventBus.on('button-download:multi-tables', handleMultiTables);

    // To emit an event for each `tableName` to component DataTable to format the excel body
    multiTableNames.forEach((each) => {
      // If downloading multi tables, doesn't need to pass additionalTexts and showTableName here, because it was handled in function `handleMultiTables`
      const event = { fileName, tableName: each, multiTableNames };
      eventBus.emit('data-table:download', event);
    });
  } else {
    // If not downlaoding multi tables, then additionalTexts directly assigned here
    const event = {
      fileName,
      tableName,
      additionalTexts: props.additionalTextBelowTable,
    };

    eventBus.emit('data-table:download', event);
  }
};

/**
 * Function to handle emitted event to download multi table
 * Collect all formatted table into 1 variable then if length of formatted table is equal to length of props.multiTableNames then it'll call function to export excel
 */
const handleMultiTables = async ({
  table,
}: Events['button-download:multi-tables']): Promise<void> => {
  // Attribute `tableName` moved into `table`
  const { tableName } = table;
  if (!usedTableNames.value.includes(tableName)) {
    tables.value[tableName] = table;
  }

  if (usedTableNames.value.length !== props.multiTableNames?.length) return;
  eventBus.off('button-download:multi-tables', handleMultiTables); // Remove listener to avoid redundant event

  const formatFileName = (): string => {
    return props.fileName
      .trim() // Remove extra space
      .replace(/[^a-zA-Z0-9\s]/g, '-') // Replace special characters with dash
      .replace(/\s+/g, '-') // Replace spaces with dash
      .replace(/-+/g, '-') // Replace multiple dashes with a single dash
      .replace(/-+$/, ''); // Remove trailing dash
  };

  const exportedTable: ITable[] = [];

  // Insert each table to `exportedTable` in order of `props.multiTableNames` to make sure it's ordered correctly
  props.multiTableNames.forEach((each) => {
    exportedTable.push(tables.value[each] as ITable);
  });

  await exportToExcel({
    tables: exportedTable,
    additionalTexts: props.additionalTextBelowTable,
    fileName: formatFileName(),
  });
};
</script>

<template>
  <button :class="Preset.root" @click="downloadExcel" type="button">
    <Icon
      v-bind="Preset.icon"
      icon="download"
      info="Download"
      severity="secondary"
      tooltip-pos="bottom"
    />
  </button>
</template>
