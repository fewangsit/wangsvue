<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import Button from '../button/Button.vue';
import {
  FilterContainerEmits,
  FilterContainerProps,
  FilterOptions,
  LoadingFilters,
  MultiSelectFilterField,
} from './FilterContainer.vue.d';
import { useForm } from 'vee-validate';

import InputRangeNumber from '../inputrangenumber/InputRangeNumber.vue';
import MultiSelect from '../multiselect/MultiSelect.vue';
import eventBus, { Events } from 'lib/event-bus';
import Calendar from '../calendar/Calendar.vue';
import applyFilter from './helpers/applyFilter.helper';

const props = withDefaults(defineProps<FilterContainerProps>(), {
  tableName: 'datatable',
  fieldsPerRow: 4,
});

const emit = defineEmits<FilterContainerEmits>();

const { resetForm, handleSubmit } = useForm();
const loading = ref<LoadingFilters>({});
const filterOption = ref<FilterOptions>({});

const container = ref<HTMLDivElement | null>(null);
const showFilter = shallowRef(false);
const fieldsKey = shallowRef(0);

onMounted(() => {
  if (container.value) {
    const { children } = container.value;
    const childCount = container.value.childElementCount;
    const isOdd = childCount % props.fieldsPerRow;

    let [rowPos, colPos] = [1, 1];
    for (const i in Array.from({ length: childCount })) {
      const isLast = Number(i) === childCount - 1;
      children[i].setAttribute(
        'style',
        `grid-area: ${rowPos}/${isLast && isOdd ? props.fieldsPerRow : colPos}`,
      );

      if (++colPos > props.fieldsPerRow) {
        colPos = 1;
        rowPos++;
      }
    }
  }

  eventBus.on('show-filter', udpateShowFIlter);
});

onBeforeUnmount(() => {
  eventBus.off('show-filter', udpateShowFIlter);
});

const udpateShowFIlter = (e: Events['show-filter']): void => {
  if (e.tableName === props.tableName) {
    showFilter.value = e.show;
  }
};

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
  fieldsKey.value++;
};

const apply = handleSubmit((values) => {
  applyFilter(values, props.tableName);
  emit('apply', values);
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
      'grid items-end p-3 gap-4',
    ]"
    :style="`grid-template-columns: repeat(${fieldsPerRow}, 1fr)`"
    @submit.prevent="apply"
    data-wv-name="filtercontainer"
  >
    <template :key="JSON.stringify(field) + fieldsKey" v-for="field of fields">
      <InputRangeNumber
        v-if="field.type == 'rangenumber'"
        v-bind="field"
        :mandatory="false"
        :max-field-name="field.fields[1]"
        :min-field-name="field.fields[0]"
        :show-optional-text="false"
        use-validator
      />
      <MultiSelect
        v-else-if="field.type == 'multiselect'"
        v-bind="field"
        :field-name="field.field"
        :loading="loading[field.field]"
        :mandatory="false"
        :options="filterOption[field.field]"
        :show-optional-text="false"
        @show="getOptions(field.fetchOptionFn, field.field)"
        option-label="label"
        option-value="value"
        use-validator
      />
      <Calendar
        v-else-if="field.type === 'calendar'"
        v-bind="field"
        :field-name="field.field"
        :mandatory="false"
        :show-optional-text="false"
        mode="range"
        use-validator
      />
    </template>
    <div
      class="flex items-end justify-end gap-2"
      data-wv-section="filteractionbuttons"
    >
      <Button
        @click="clear"
        data-wv-section="clearbutton"
        label="Bersihkan Field"
        text
      />
      <Button
        @click="apply"
        data-wv-section="applybutton"
        label="Terapkan"
        severity="success"
      />
    </div>
  </form>
</template>
