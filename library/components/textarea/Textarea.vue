<script setup lang="ts">
import { computed, inject, onMounted, reactive, watch } from 'vue';
import type { TextareaEmits, TextareaProps } from './Textarea.vue.d';

import { FieldValidation } from '../form/Form.vue.d';
import { Nullable } from 'lib/components/ts-helpers.d';
import { useField } from 'vee-validate';

import Textarea from 'primevue/textarea';
import FieldWrapper from '../fieldwrapper/FieldWrapper.vue';
import ValidatorMessage from '../validatormessage/ValidatorMessage.vue';

const props = withDefaults(defineProps<TextareaProps>(), {
  autoResize: true,
  maxInput: undefined,
  fieldName: 'textareaInput',
  rows: 5,
});

const emit = defineEmits<TextareaEmits>();

onMounted(() => {
  setValidator();
});

const Preset = inject<Record<string, any>>('preset', {}).textarea;

const field = reactive<FieldValidation<Nullable<string>>>({
  value: props.value?.trim() ?? props.modelValue?.trim(),
});

const invalidInput = computed(() => props.invalid || !!field.errorMessage);
const invalidMessage = computed(() =>
  props.invalid ? props.validatorMessage : field.errorMessage,
);

const inputPlaceholder = computed(
  () =>
    props.placeholder ??
    `Enter ${props.label ? props.label.toLowerCase() : 'text'}`,
);

const setValidator = (): void => {
  if (props.useValidator) {
    Object.assign(
      field,
      useField(props.fieldName, (value: Nullable<string>) => {
        return setValidatorMessage(value?.trim());
      }),
    );

    // Need to re-assign field.value because Object.assign remove its value
    if (props.value ?? props.modelValue) {
      field.value = props.value?.trim() ?? props.modelValue?.trim();
    }
  }
};

const setValidatorMessage = (value: Nullable<string>): string | boolean => {
  if (typeof props.validatorMessage === 'string' && props.invalid) {
    return props.validatorMessage;
  } else if (typeof props.validatorMessage !== 'string') {
    const { empty, exceed } = props.validatorMessage ?? {};
    if (!value && props.mandatory) {
      return empty ?? `${props.label} must not be empty`;
    } else if (props.maxInput && (value?.length ?? 0) > props.maxInput) {
      return exceed ?? 'Max. ' + props.maxInput + ' characters';
    }
  }

  return true;
};

watch(
  () => props.value,
  (newValue) => {
    field.value = newValue?.trim();
  },
  { once: true },
);

watch(
  () => props.modelValue,
  (value) => {
    field.value = value?.trim();
  },
);
</script>
<template>
  <FieldWrapper
    :info="fieldInfo"
    :label="props.label"
    :mandatory="props.mandatory"
  >
    <Textarea
      v-model="field.value"
      v-bind="Preset.root({ props, context: { disabled, invalidInput } })"
      :auto-resize="autoResize"
      :disabled="disabled"
      :maxlength="maxlength"
      :placeholder="inputPlaceholder"
      :rows="rows"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <ValidatorMessage :message="invalidMessage" />
  </FieldWrapper>
</template>
