<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, shallowRef } from 'vue';

import Menu from 'lib/components/menu/Menu.vue';
import {
  ButtonBulkActionEmits,
  ButtonBulkActionProps,
} from './ButtonBulkAction.vue.d';
import { MenuItem } from '../menuitem';
import { filterVisibleMenu } from '../helpers';
import Button from '../button/Button.vue';
import eventBus, { Events } from 'lib/event-bus';
import { Data } from '../datatable/DataTable.vue.d';

const props = withDefaults(defineProps<ButtonBulkActionProps>(), {
  tableName: 'datatable',
  useButton: true,
});

const emit = defineEmits<ButtonBulkActionEmits>();

onMounted(() => {
  window.addEventListener('updateTotalRecords', updateTotalRecordsHandler);
  window.addEventListener('disableBulkAction', disableBulkAction);

  eventBus.on('update:selectedData', handleUpdateSelectedData);
});

onUnmounted(() => {
  window.removeEventListener('updateTotalRecords', updateTotalRecordsHandler);
  window.removeEventListener('disableBulkAction', disableBulkAction);
  eventBus.off('update:selectedData');
});

const menu = ref();
const selectedOption = shallowRef<MenuItem>();
const totalRecords = shallowRef<number>(0);
const isAllDataSelected = shallowRef<boolean>(false);
const isDisabled = shallowRef<boolean>(false);
const dataSelected = shallowRef<Data[] | undefined>(props.selectedData);

const bulkOptions = computed(() => {
  return filterVisibleMenu(props.options);
});

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
};

const unSelectAllData = (): void => {
  emit('update:selectedData', []);
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
  event: CustomEvent<{ total: number; name: string }>,
): void => {
  if (props.tableName === event?.detail?.name) {
    totalRecords.value = event?.detail?.total;
  }
};

const handleUpdateSelectedData = (e: Events['update:selectedData']): void => {
  if (e.tableName === props.tableName) {
    dataSelected.value = e.data;
  }
};

watch([dataSelected, totalRecords], ([datas, total]) => {
  if (!datas?.length) selectedOption.value = undefined;
  isAllDataSelected.value = datas?.length === total;
});

watch(
  () => props.totalRecords,
  (total) => (totalRecords.value = total ?? 0),
  { immediate: true },
);
</script>

<template>
  <div v-show="selectedData?.length" class="flex gap-2 items-center">
    <Menu
      id="bulkaction-overlay-menu"
      ref="menu"
      v-if="selectedData?.length"
      :model="bulkOptions"
      :popup="true"
      data-ts-section="ts-bulkaction-menu"
    />

    <span
      v-show="selectedData?.length"
      class="text-xs text-grayscale-900 cursor-default whitespace-nowrap"
      data-ts-section="ts-selection-message"
    >
      {{ selectedData?.length }} data dipilih
    </span>

    <Button
      v-show="showSelectAllButton"
      @click="selectAllData"
      class="!p-1.5 -ml-1.5 -mr-1.5"
      data-section-name="button-select-all"
      text
    >
      Pilih semua ({{ totalRecords }} data)
    </Button>

    <Button
      @click="toggleMenu"
      icon="ellipsis-h"
      outlined
      severity="secondary"
      size="small"
    />
    <Button
      @click="unSelectAllData"
      class="!p-0 !w-6 !h-6 [&_.icon]:!w-5 [&_.icon]:!h-5"
      icon="close"
      severity="danger"
      text
    />
  </div>
</template>
