<script setup lang="ts">
import InputNumber from 'primevue/inputnumber';
import FieldWrapper from '../fieldwrapper/FieldWrapper.vue';
import InputGroup from '../inputgroup/InputGroup.vue';

import {
  InputRangeNumberEmits,
  InputRangeNumberProps,
} from './InputRangeNumber.vue.d';
import { reactive, watch, onMounted } from 'vue';
import { useField } from 'vee-validate';
import { FieldValidation } from 'lib/types/validation.type';

const props = withDefaults(defineProps<InputRangeNumberProps>(), {
  minPlaceholder: 'Tulis',
  maxPlaceholder: 'Tulis',
  placeholder: 'Tulis',
});

const emit = defineEmits<InputRangeNumberEmits>();

const field = reactive<FieldValidation<number[]>>({ value: undefined });

onMounted(() => {
  if (props.useValidator) {
    Object.assign(
      field,
      useField(props.fieldName ?? 'rangeNumberInput', () => {
        return true;
      }),
    );

    // Check if props.value is not null or undefined
    if (props.value != null) field.value = props.value;
  }
});

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') emit('submit');
};

const updateFieldValue = (value: number | null, index: number): void => {
  if (field.value) {
    field.value[index] = value;
  } else {
    field.value = [value];
  }

  emit('update:modelValue', field.value);
};

// Watch for changes in the rangeValue model
watch(
  field.value,
  (newValue) => {
    emit('update:modelValue', newValue);
  },
  { deep: true },
); // Deep watch to detect changes within the array

// Watch for changes in props.value (for async data)
watch(
  () => props.value,
  (value) => {
    field.value = value;
  },
  { once: true },
);

// Watch for changes in props.modelValue
watch(
  () => props.modelValue,
  (model) => {
    field.value = model;
  },
);
</script>
<template>
  <FieldWrapper :label="props.label">
    <div
      class="flex gap-2 w-full items-center"
      data-section-name="inputwrapper"
    >
      <InputGroup>
        <InputNumber
          v-bind="$props"
          :model-value="field.value?.[0]"
          :placeholder="placeholder ?? minPlaceholder"
          :use-grouping="false"
          @keydown="handleKeydown"
          @update:model-value="updateFieldValue($event, 0)"
          class="w-full"
          input-id="range-start"
        />
      </InputGroup>
      -
      <InputGroup>
        <InputNumber
          v-bind="$props"
          :model-value="field.value?.[1]"
          :placeholder="placeholder ?? minPlaceholder"
          :use-grouping="false"
          @keydown="handleKeydown"
          @update:model-value="updateFieldValue($event, 1)"
          class="w-full"
          input-id="range-end"
        />
      </InputGroup>
    </div>
  </FieldWrapper>
</template>
