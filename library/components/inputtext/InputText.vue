<script setup lang="ts">
import {
  computed,
  onMounted,
  reactive,
  shallowRef,
  watch,
  nextTick,
  inject,
} from 'vue';
import { useField } from 'vee-validate';
import { Nullable } from '../ts-helpers';
import { FieldValidation } from '../form/Form.vue.d';

import { InputTextEmits, InputTextProps } from './InputText.vue.d';

import InputText from 'primevue/inputtext';
import FieldWrapper from '../fieldwrapper/FieldWrapper.vue';
import ValidatorMessage from '../validatormessage/ValidatorMessage.vue';
import InputGroup from '../inputgroup/InputGroup.vue';
import InputGroupAddon from 'primevue/inputgroupaddon';

const props = withDefaults(defineProps<InputTextProps>(), {
  maxLength: 30,
  type: 'text',
  blurOnReachMaxLength: false,
  manualInvalidContainer: false,
  useProtocol: true,
});

const emit = defineEmits<InputTextEmits>();

const InputGroupAddonPreset = inject<Record<string, any>>(
  'preset',
  {},
).inputgroupaddon;

const field = reactive<FieldValidation<Nullable<string>>>({
  value: props.modelValue?.trim(),
});

const invalidInput = computed(() => props.invalid || !!field.errorMessage);
const inputKey = shallowRef(0);

onMounted(() => {
  if (props.useValidator) {
    Object.assign(
      field,
      useField(props.fieldName ?? 'textInput', (value: string) => {
        return nextTick(() => {
          return setValidatorMessage(value?.trim());
        }); // Waits props.invalid changed
      }),
    );

    // eslint-disable-next-line eqeqeq
    if (props.value != null) field.value = props.value?.trim();
    if (props.modelValue != null) field.value = props.modelValue?.trim();
  }
});

const inputPlaceholder = computed(
  () =>
    props.placeholder ??
    'Tulis ' + (props.label ? props.label?.toLowerCase() : ''),
);

const setValidatorMessage = (value: string): boolean | string => {
  if (typeof props.validatorMessage === 'string' && props.invalid) {
    return props.validatorMessage;
  } else if (typeof props.validatorMessage !== 'string') {
    const { invalidFormat, empty, exceed } = props.validatorMessage ?? {};
    if (!value && props.mandatory) {
      return empty ?? true;
    } else if (value?.length > props.maxLength && props.type === 'text') {
      return exceed ?? true;
    } else if (value && props.type === 'email') {
      return validateEmail(value, invalidFormat ?? 'Format URL tidak valid');
    } else if (value && props.type === 'url') {
      return validateURL(value, invalidFormat ?? 'Format URL tidak valid');
    } else if (props.existingValues?.includes(value)) {
      return props.validatorMessage?.exist ?? props.label + ' sudah ada';
    }
  }

  return true;
};

const validateURL = (
  value: string,
  invalidFormat?: string,
): boolean | string => {
  const urlRegExp = new RegExp(
    `^(https?:\\/\\/)${props.useProtocol ? '' : '?'}` + // Protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // Domain name and extension
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?' + // Port
      '(\\/[-a-z\\d%_.~+]*)*' + // Path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // Query string
      '(\\#[-a-z\\d_]*)?$',
    'i', // Fragment locator
  );

  return invalidFormat == null || urlRegExp.test(value) ? true : invalidFormat;
};

const validateEmail = (
  value: string,
  invalidFormat?: string,
): boolean | string => {
  const emailRegexp = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return invalidFormat == null || emailRegexp.test(value)
    ? true
    : invalidFormat;
};

const onUpdateModelValue = (e?: string): void => {
  if (
    e &&
    props.blurOnReachMaxLength &&
    props.maxLength &&
    e.length > props.maxLength
  ) {
    const max = props.maxLength;
    const sliced = e.slice(0, max);
    emit('update:modelValue', sliced);
    if (props.useValidator) field.value = sliced;
    inputKey.value++;
  } else {
    emit('update:modelValue', e);
    if (props.useValidator) field.value = e;
  }
};

/**
 * For async data, watch the changes of modelValue once.
 */
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

watch(
  () => props.invalid,
  () => {
    field.validate?.();
  },
);
</script>

<template>
  <FieldWrapper
    :info="fieldInfo"
    :label="props.label"
    :label-class="props.labelClass"
    :mandatory="props.mandatory"
  >
    <InputGroup
      :class="
        props.inputContainerClass ?? [
          'grid ',
          {
            'grid-cols-[max-content,1fr,max-content]':
              $slots['addon-left'] && $slots['addon-right'],
            'grid-cols-[1fr,max-content]':
              !$slots['addon-left'] && $slots['addon-right'],
            'grid-cols-[max-content,1fr]':
              $slots['addon-left'] && !$slots['addon-right'],
          },
        ]
      "
      :disabled="props.disabled"
      :invalid="invalidInput && !props.manualInvalidContainer"
    >
      <InputGroupAddon v-if="$slots['addon-left']" :disabled="props.disabled">
        <slot name="addon-left" />
      </InputGroupAddon>

      <InputText
        :key="inputKey"
        :class="inputClass"
        :disabled="disabled"
        :invalid="invalidInput"
        :model-value="field.value"
        :placeholder="inputPlaceholder"
        @blur="emit('blur', ($event.target as HTMLInputElement).value)"
        @input="emit('input', ($event.target as HTMLInputElement).value)"
        @update:model-value="onUpdateModelValue"
      />

      <InputGroupAddon
        v-if="$slots['addon-right']"
        :pt="{
          root: InputGroupAddonPreset.root({
            props: {
              class: [
                {
                  '!text-general-200': props.disabled,
                },
              ],
            },
          }),
        }"
      >
        <slot name="addon-right" />
      </InputGroupAddon>
    </InputGroup>
    <ValidatorMessage
      :class="validatorMessageClass"
      :message="field.errorMessage"
    />
  </FieldWrapper>
</template>
