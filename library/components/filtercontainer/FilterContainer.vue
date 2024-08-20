<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import Button from '../button/Button.vue';
import {
  FilterContainerProps,
  FilterOptions,
  LoadingFilters,
  MultiSelectFilterField,
} from './FilterContainer.vue.d';
import { useForm } from 'vee-validate';
import { QueryParams } from '../datatable/DataTable.vue.d';

import InputRangeNumber from '../inputrangenumber/InputRangeNumber.vue';
import MultiSelect from '../multiselect/MultiSelect.vue';
import eventBus from 'lib/event-bus';
import Calendar from '../calendar/Calendar.vue';

const props = withDefaults(defineProps<FilterContainerProps>(), {
  tableName: 'datatable',
});

const { resetForm, handleSubmit } = useForm();
const loading = ref<LoadingFilters>({});
const filterOption = ref<FilterOptions>({});

const container = ref<HTMLDivElement | null>(null);
const contentKey = shallowRef<number>(0);
const showFilter = shallowRef(false);

onMounted(() => {
  if (container.value) {
    const { children } = container.value;
    const childCount = container.value.childElementCount;
    const isOdd = childCount % 4;

    let [rowPos, colPos] = [1, 1];
    for (const i in Array.from({ length: childCount })) {
      const isLast = Number(i) === childCount - 1;
      children[i].setAttribute(
        'style',
        `grid-area: ${rowPos}/${isLast && isOdd ? 4 : colPos}`,
      );

      if (++colPos > 4) {
        colPos = 1;
        rowPos++;
      }
    }
  }

  eventBus.on('showFilter', (e) => (showFilter.value = e.show));
});

onBeforeUnmount(() => {
  eventBus.off('showFilter');
});

const getOptions = async (
  fn: MultiSelectFilterField['fetchOptionFn'],
  field: string,
): Promise<void> => {
  try {
    loading.value[field] = true;
    const params = { [field]: true };
    const option = await fn?.(params);

    if (option) filterOption.value[field] = option;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value[field] = false;
  }
};

const clear = (): void => {
  resetForm();
};

const apply = handleSubmit((values) => {
  const fields = Object.keys(values);
  const parsedFilter: QueryParams = {};

  eventBus.emit('hideOverlay');

  fields.forEach((field) => {
    parsedFilter[field] = JSON.stringify(values[field]);
  });

  eventBus.emit('filterTable', {
    tableName: props.tableName,
    filter: parsedFilter,
  });

  eventBus.emit('clear:selectedData', { tableName: props.tableName });
});

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <form
    ref="container"
    v-show="showFilter"
    :class="[
      ' bg-primary-50 rounded-[7px] [&>*]:w-full [&>*]min-w-0',
      'grid items-end grid-cols-4 p-3 gap-4',
    ]"
    @submit.prevent="apply"
    data-name="filter-container"
  >
    <slot :key="contentKey">
      <template :key="field" v-for="field of fields">
        <InputRangeNumber
          v-if="field.type == 'rangenumber'"
          v-bind="field"
          :max-field-name="field.fields[1]"
          :min-field-name="field.fields[0]"
          use-validator
        />
        <MultiSelect
          v-else-if="field.type == 'multiselect'"
          v-bind="field"
          :field-name="field.field"
          :loading="loading[field.field]"
          :options="filterOption[field.field]"
          @show="getOptions(field.fetchOptionFn, field.field)"
          option-label="label"
          option-value="value"
          use-validator
        />
        <Calendar
          v-else-if="field.type === 'calendar'"
          v-bind="field"
          :field-name="field.field"
          mode="range"
          use-validator
        />
      </template>
    </slot>
    <div
      class="flex items-end justify-end gap-2"
      data-section-name="filter-action-buttons"
    >
      <Button @click="clear" label="Bersihkan Field" text />
      <Button @click="apply" label="Terapkan" severity="success" />
    </div>
  </form>
</template>
