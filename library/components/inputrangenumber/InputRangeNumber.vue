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

// Separate fields for min and max values
const minField = reactive<FieldValidation<number | undefined>>({
  value: undefined,
});
const maxField = reactive<FieldValidation<number | undefined>>({
  value: undefined,
});

onMounted(() => {
  if (props.useValidator) {
    // Initialize minField and maxField with vee-validate
    Object.assign(
      minField,
      useField(
        props.minFieldName ?? 'minNumberInput',
        () => {
          return true;
        },
        { initialValue: undefined },
      ),
    );

    Object.assign(
      maxField,
      useField(
        props.maxFieldName ?? 'maxNumberInput',
        () => {
          return true;
        },
        { initialValue: undefined },
      ),
    );

    // Check if props.value is not null or undefined
    if (props.value) {
      minField.value = props.value[0];
      maxField.value = props.value[1];
    }
  }
});

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') emit('submit');
};

// Watch for changes in minField and maxField
watch(
  [
    (): number | undefined => minField.value,
    (): number | undefined => maxField.value,
  ],
  ([newMinValue, newMaxValue]) => {
    emit('update:modelValue', [newMinValue, newMaxValue]);
  },
);

// Watch for changes in props.value (for async data)
watch(
  () => props.value,
  (value) => {
    minField.value = value ? value[0] : undefined;
    maxField.value = value ? value[1] : undefined;
  },
  { once: true },
);

// Watch for changes in props.modelValue
watch(
  () => props.modelValue,
  (model) => {
    minField.value = model ? model[0] : undefined;
    maxField.value = model ? model[1] : undefined;
  },
);
</script>

<template>
  <FieldWrapper :label="props.label" :show-optional-text="showOptionalText">
    <div
      class="flex gap-2 w-full items-center"
      data-section-name="inputwrapper"
    >
      <InputGroup>
        <InputNumber
          v-bind="$props"
          v-model="minField.value"
          :placeholder="placeholder ?? minPlaceholder"
          :use-grouping="false"
          @keydown="handleKeydown"
          class="w-full"
          input-id="range-start"
        />
      </InputGroup>
      -
      <InputGroup>
        <InputNumber
          v-bind="$props"
          v-model="maxField.value"
          :placeholder="placeholder ?? maxPlaceholder"
          :use-grouping="false"
          @keydown="handleKeydown"
          class="w-full"
          input-id="range-end"
        />
      </InputGroup>
    </div>
  </FieldWrapper>
</template>
