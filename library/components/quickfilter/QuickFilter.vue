<script setup lang="ts">
import { ref } from 'vue';
import Icon from '../icon/Icon.vue';
import InputRangeNumber from '../inputrangenumber/InputRangeNumber.vue';
import MultiSelect from '../multiselect/MultiSelect.vue';
import {
  QuickFilterEmits,
  QuickFilterField,
  QuickFilterProps,
} from './QuickFilter.vue.d';
import { useForm } from 'vee-validate';
import { MultiSelectOption } from 'lib/types/options.type';
import { isEmptyObject } from 'lib/utils';

const { values, resetForm } = useForm();

const loading = ref<Record<string, boolean>>({});
const filterOption = ref<Record<string, MultiSelectOption[]>>({});

defineProps<QuickFilterProps>();
defineEmits<QuickFilterEmits>();

const clear = (): void => {
  resetForm();
};

const getOptions = async (
  fn: QuickFilterField['fetchOptionFn'],
  field: string,
): Promise<void> => {
  try {
    loading.value[field] = true;
    filterOption.value[field] = [];
    const option = await fn?.();

    if (option) filterOption.value[field] = option;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value[field] = false;
  }
};
</script>

<template>
  <div :class="['flex items-center', { 'gap-3': !isEmptyObject(values) }]">
    <div :class="['grid gap-3', `grid-cols-${fields.length}`]">
      <template
        :key="type"
        v-for="{ type, field, placeholder, fetchOptionFn, tooltip } of fields"
      >
        <InputRangeNumber
          v-if="type == 'rangenumber'"
          v-tooltip.top="tooltip"
          :field-name="field"
          :placeholder="placeholder"
          @update:model-value="$emit('change', values)"
          use-validator
        />
        <MultiSelect
          v-else-if="type == 'multiselect'"
          :field-name="field"
          :loading="loading[field]"
          :options="filterOption[field]"
          :placeholder="placeholder"
          @show="getOptions(fetchOptionFn, field)"
          @update:model-value="$emit('change', values)"
          option-label="label"
          option-value="value"
          use-validator
        />
      </template>
    </div>

    <button
      v-show="!isEmptyObject(values)"
      @click="clear"
      class="rounded-full hover:bg-danger-300/20 p-0.5"
      type="button"
    >
      <Icon class="shrink-0 w-6 h-6" icon="close" severity="danger" />
    </button>
  </div>
</template>
