<script setup lang="ts">
import type {
  CheckboxProps,
  CheckboxEmits,
  CheckboxModelValue,
} from './Checkbox.vue.d';

import { inject, onMounted, reactive, watch } from 'vue';
import { useField } from 'vee-validate';
import { FieldValidation } from '../form/Form.vue.d';
import Checkbox from 'primevue/checkbox';
import Icon from '../icon/Icon.vue';

const Preset = inject<Record<string, any>>('preset', {}).checkbox;

const props = withDefaults(defineProps<CheckboxProps>(), {
  binary: true,
  selectable: true,
  inputId: 'checkbox',
  withinTable: false,
});

defineEmits<CheckboxEmits>();
const modelValue = defineModel<CheckboxModelValue>('modelValue');

const field = reactive<FieldValidation<boolean | CheckboxModelValue>>({
  value: props.modelValue ?? props.value,
});

onMounted(() => {
  if (props.useValidator) {
    Object.assign(field, useField(props.fieldName ?? 'checkbox'));

    // eslint-disable-next-line eqeqeq
    if (props.value != null) field.value = props.value;
  }
});

watch(
  () => field.value,
  () => {
    modelValue.value = field.value;
  },
);

watch(
  () => props.value,
  () => {
    field.value = props.value;
  },
);

watch(
  () => props.modelValue,
  () => {
    field.value = props.modelValue;
  },
);
</script>

<template>
  <label
    :class="[
      'flex w-max text-xs font-normal text-grayscale-900 items-center cursor-pointer',
      { 'gap-1': props.label },
      { 'pointer-events-none': !selectable },
    ]"
    data-wv-name="checkbox"
  >
    <Checkbox
      v-bind="$props"
      v-model="field.value"
      :input-id="inputId"
      :pt="{
        input: { disabled: !selectable || disabled },
      }"
      data-wv-section="checkbox-input"
    >
      <template #icon>
        <Icon
          :class="[...Preset.icon.class, { 'text-transparent': !modelValue }]"
          icon="check"
        />
      </template>
    </Checkbox>

    <span
      class="flex items-start gap-px select-none tracking-[0.02em] leading-none"
      data-wv-section="checkbox-label"
    >
      {{ label }}
      <Icon
        v-if="tooltip"
        :info="tooltip"
        :tooltip-pos="tooltipPos"
        class="w-[10px] h-[10px] text-grayscale-900"
        data-wv-section="tooltip-icon"
        icon="info"
      />
    </span>
  </label>
</template>
