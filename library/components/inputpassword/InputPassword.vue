<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch, inject } from 'vue';
import Password from 'primevue/password';
import FieldWrapper from '../fieldwrapper/FieldWrapper.vue';
import InputGroup from '../inputgroup/InputGroup.vue';
import type {
  InputPasswordProps,
  InputPasswordEmits,
} from './InputPassword.vue.d';
import { FieldValidation } from '../form/Form.vue.d';

import { useField } from 'vee-validate';
import ValidatorMessage from '../validatormessage/ValidatorMessage.vue';
import Icon from '../icon/Icon.vue';

const Preset = inject<Record<string, any>>('preset', {}).password;

const props = defineProps<InputPasswordProps>();

const emit = defineEmits<InputPasswordEmits>();

const inputModel = ref<string | undefined>(props.modelValue);
const field = reactive<FieldValidation<typeof props.modelValue>>({
  value: undefined,
});

const invalidInput = computed(() => props.invalid || !!field.errorMessage);
const invalidMessage = computed(() => {
  if (props.invalid && props.validatorMessage) return props.validatorMessage;
  return field.errorMessage;
});

onMounted(() => {
  if (props.useValidator) {
    Object.assign(
      field,
      useField(props.fieldName ?? 'password', (value: string) => {
        return setValidatorMessage(value);
      }),
    );

    if (props.modelValue != null) field.value = props.modelValue;
  }
});

const setValidatorMessage = (value: string): boolean | string => {
  if (!value && props.mandatory) {
    return `${props.label} must not be empty`;
  } else if (props.validatorMessage && props.invalid) {
    return props.validatorMessage;
  }

  return true;
};

const updateFieldValue = (event: string | undefined): void => {
  emit('update:modelValue', event);

  if (props.useValidator) field.value = event;
};

/**
 * Focusing input element after toggle mask.
 * @param e ClickEvent
 */
const focusInput = (e: MouseEvent): void => {
  // Ensure the target is an HTMLElement to access the previousElementSibling property
  const target = e.target as HTMLElement;

  // Check if the previous element sibling exists and is an input element
  if (
    target.previousElementSibling &&
    target.previousElementSibling.tagName === 'INPUT'
  ) {
    // Cast the previous element sibling to HTMLInputElement to call the focus method
    const input = target.previousElementSibling as HTMLInputElement;
    input.focus();
  }
};

/**
 * For async data, watch the changes of modelValue once.
 */
watch(
  () => props.modelValue,
  (value) => {
    inputModel.value = value;
    field.value = value;
  },
);

watch(
  () => props.invalid,
  () => {
    field.validate?.();
  },
);
</script>

<template>
  <FieldWrapper
    :label="props.label"
    :label-class="props.labelClass"
    :mandatory="props.mandatory"
  >
    <InputGroup :class="props.inputContainerClass" :invalid="invalidInput">
      <Password
        v-model="inputModel"
        :feedback="props.feedback"
        :invalid="invalidInput"
        :placeholder="props.placeholder"
        @update:model-value="updateFieldValue"
        toggle-mask
      >
        <template #showicon="{ toggleCallback }">
          <button
            :class="Preset?.showicon.class"
            @click="toggleCallback(), focusInput($event)"
            class="unset"
          >
            <Icon icon="eye" />
          </button>
        </template>

        <template #hideicon="{ toggleCallback }">
          <button
            :class="Preset?.showicon.class"
            @click="toggleCallback(), focusInput($event)"
            class="unset"
          >
            <Icon icon="eye-off" />
          </button>
        </template>
      </Password>
    </InputGroup>
    <ValidatorMessage
      :class="props.validatorMessageClass"
      :message="invalidMessage"
    />
  </FieldWrapper>
</template>
