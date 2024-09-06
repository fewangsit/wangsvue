<script setup lang="ts">
import { computed, onMounted, reactive, watch } from 'vue';
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
  textareaPt: undefined,
});

const emit = defineEmits<TextareaEmits>();

onMounted(() => {
  setValidator();
});

const field = reactive<FieldValidation<Nullable<string>>>({
  value: props.value?.trim() ?? props.modelValue?.trim(),
});

const invalidInput = computed(() => props.invalid || !!field.errorMessage);

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
      :auto-resize="autoResize"
      :class="[
        {
          'resize-none': autoResize,
          'resize': !autoResize,
        },
        {
          '!border-danger-500 border:bg-danger-500': invalidInput,
        },
        inputClass,
        `min-h-[${rows * 26}px]`,
      ]"
      :disabled="disabled"
      :maxlength="props.maxlength"
      :placeholder="inputPlaceholder"
      :pt="props.textareaPt"
      :rows="props.rows"
      @update:model-value="emit('update:modelValue', $event)"
    />
    <ValidatorMessage :message="field.errorMessage" />
  </FieldWrapper>
</template>
