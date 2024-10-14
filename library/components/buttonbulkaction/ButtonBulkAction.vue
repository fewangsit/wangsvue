<script setup lang="ts">
import {
  computed,
  ref,
  watch,
  onMounted,
  onUnmounted,
  shallowRef,
  inject,
} from 'vue';

import Menu from 'lib/components/menu/Menu.vue';
import {
  ButtonBulkActionEmits,
  ButtonBulkActionProps,
} from './ButtonBulkAction.vue.d';
import { MenuItem } from '../menuitem';
import { Data } from '../datatable/DataTable.vue.d';

import Button from '../button/Button.vue';
import eventBus, { Events } from 'lib/event-bus';

const props = withDefaults(defineProps<ButtonBulkActionProps>(), {
  tableName: 'datatable',
  useButton: true,
  selectedData: [],
  options: [],
});

const emit = defineEmits<ButtonBulkActionEmits>();

onMounted(() => {
  window.addEventListener('disableBulkAction', disableBulkAction);

  eventBus.on('data-table:update-selected-data', handleUpdateSelectedData);
  eventBus.on('data-table:update-total-record', updateTotalRecordsHandler);
});

onUnmounted(() => {
  window.removeEventListener('disableBulkAction', disableBulkAction);
  eventBus.off('data-table:update-total-record');
  eventBus.off('data-table:update-selected-data');
});

const Preset = inject<Record<string, any>>('preset', {}).buttonbulkaction;

const menu = ref();
const selectedOption = shallowRef<MenuItem>();
const totalRecords = shallowRef<number>(0);
const isAllDataSelected = shallowRef<boolean>(false);
const isDisabled = shallowRef<boolean>(false);
const dataSelected = ref<Data[] | undefined>(props.selectedData);

const showSelectAllButton = computed(
  () =>
    dataSelected.value?.length && !isDisabled.value && totalRecords.value > 0,
);

const selectAllData = (): void => {
  /**
   * Trigger fetch all data from data table.
   *
   */
  window.dispatchEvent(
    new CustomEvent('fetchAllData', { detail: props.tableName }),
  );

  eventBus.emit('data-table:select-all-record', { tableName: props.tableName });
};

const unSelectAllData = (): void => {
  emit('update:selectedData', []);
  eventBus.emit('data-table:clear-selected-data', {
    tableName: props.tableName,
  });
};

const disableBulkAction = (event: CustomEvent): void => {
  if (props.tableName === event.detail.tableName)
    isDisabled.value = event.detail.value;
};

const toggleMenu = (e: Event): void => {
  menu.value?.toggle(e);
};

/**
 * Handle the event when the total records is updated from the data table.
 * @param event custom event with totalRecords data.
 */
const updateTotalRecordsHandler = (
  event: Events['data-table:update-total-record'],
): void => {
  if (props.tableName === event?.tableName) {
    totalRecords.value = event?.total;
  }
};

const handleUpdateSelectedData = (
  e: Events['data-table:update-selected-data'],
): void => {
  if (e.tableName === props.tableName) {
    dataSelected.value = e.data;
    emit('update:selectedData', e.data ?? []);
  }
};

watch(
  [dataSelected, totalRecords],
  ([data, total]) => {
    if (!data?.length) selectedOption.value = undefined;
    isAllDataSelected.value = data?.length === total;
  },
  { deep: true },
);

watch(
  () => props.totalRecords,
  (total) => (totalRecords.value = total ?? 0),
  { immediate: true },
);
</script>

<template>
  <div v-show="dataSelected?.length" v-bind="Preset.root">
    <Menu
      ref="menu"
      v-if="dataSelected?.length"
      v-bind="Preset.menu"
      :model="options"
      popup
    />

    <span v-show="dataSelected?.length" v-bind="Preset.selectionmessage">
      {{ dataSelected?.length }} data dipilih
    </span>

    <Button
      v-show="showSelectAllButton"
      @click="selectAllData"
      v-bind="
        Preset.buttonselectall({ context: { selectedAll: isAllDataSelected } })
      "
      text
    >
      <template v-if="!isAllDataSelected">
        Pilih semua ({{ totalRecords }} data)
      </template>
      <template v-else> Semua data terpilih </template>
    </Button>

    <Button
      @click="toggleMenu"
      v-bind="Preset.bulkactiontoggle"
      icon="ellipsis-h"
      outlined
      severity="secondary"
      size="small"
    />
    <Button
      @click="unSelectAllData"
      v-bind="Preset.buttonclearselection"
      icon="close"
      severity="danger"
      text
    />
  </div>
</template>
