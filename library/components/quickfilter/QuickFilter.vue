<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { QuickFilterProps } from './QuickFilter.vue.d';
import { useForm } from 'vee-validate';
import { MultiSelectOption } from 'lib/types/options.type';
import { isEmptyObject } from 'lib/utils';
import { MultiSelectFilterField } from '../filtercontainer/FilterContainer.vue.d';
import Icon from '../icon/Icon.vue';
import InputRangeNumber from '../inputrangenumber/InputRangeNumber.vue';
import MultiSelect from '../multiselect/MultiSelect.vue';
import applyFilter from '../filtercontainer/helpers/applyFilter.helper';
import Calendar from '../calendar/Calendar.vue';

const { values, resetForm } = useForm();

const loading = ref<Record<string, boolean>>({});
const fieldsKey = shallowRef(0);
const filterOption = ref<Record<string, MultiSelectOption[]>>({});

const props = withDefaults(defineProps<QuickFilterProps>(), {
  tableName: 'datatable',
});

const clear = (): void => {
  resetForm();
  fieldsKey.value++;
  apply();
};

const apply = (): void => {
  applyFilter(values, props.tableName);
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
</script>

<template>
  <div
    :class="[
      'grid grid-cols-1 items-center',
      { 'gap-3 grid-cols-[auto,max-content]': !isEmptyObject(values) },
    ]"
    data-wv-name="quickfilter"
  >
    <div
      :class="['grid gap-3 transition-transform']"
      :style="`grid-template-columns: repeat(${fields.length}, 1fr)`"
      data-wv-section="quickfilterfields"
    >
      <template
        :key="JSON.stringify(field) + fieldsKey"
        v-for="field of fields"
      >
        <InputRangeNumber
          v-if="field.type == 'rangenumber'"
          v-tooltip.top="field.tooltip"
          v-bind="field"
          :label="undefined"
          :max-field-name="field.fields[1]"
          :min-field-name="field.fields[0]"
          @update:model-value="apply"
          use-validator
        />
        <MultiSelect
          v-else-if="field.type == 'multiselect'"
          v-bind="field"
          :field-name="field.field"
          :label="undefined"
          :loading="loading[field.field]"
          :options="filterOption[field.field]"
          @show="getOptions(field.fetchOptionFn, field.field)"
          @update:model-value="apply"
          option-label="label"
          option-value="value"
          use-validator
        />
        <Calendar
          v-else-if="field.type === 'calendar'"
          v-bind="field"
          :field-name="field.field"
          :label="undefined"
          @update:model-value="apply"
          mode="range"
          use-validator
        />
      </template>
    </div>

    <button
      v-show="!isEmptyObject(values)"
      @click="clear"
      class="rounded-full hover:bg-danger-300/20 p-0.5"
      data-wv-section="quickfilterclearbutton"
      type="button"
    >
      <Icon class="shrink-0 w-6 h-6" icon="close" severity="danger" />
    </button>
  </div>
</template>
