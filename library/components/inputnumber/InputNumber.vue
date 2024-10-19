<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue';
import { useField } from 'vee-validate';
import { FieldValidation } from '../form/Form.vue.d';

import type {
  InputNumberProps,
  InputNumberEmits,
  InputNumberEvent,
} from './InputNumber.vue.d';

import InputNumber, { InputNumberInputEvent } from 'primevue/inputnumber';
import FieldWrapper from '../fieldwrapper/FieldWrapper.vue';
import ValidatorMessage from '../validatormessage/ValidatorMessage.vue';

import InputGroup from '../inputgroup/InputGroup.vue';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Icon from '../icon/Icon.vue';

const props = withDefaults(defineProps<InputNumberProps>(), {
  maxDigit: 16,
  padStart: 0,
  showValidatorMessage: true,
  allowEmptyValue: true,
  addonVariant: 'filled',
});

const emit = defineEmits<InputNumberEmits>();

const InputGroupAddonPreset = inject<Record<string, any>>(
  'preset',
  {},
).inputgroupaddon;

const inputKey = ref<number>(0);
const inputNumber = ref<InputNumber>();

const field = reactive<FieldValidation<number | undefined>>({
  value: props.value ?? props.modelValue,
});

const inputPlaceholder = computed(
  () =>
    props.placeholder ??
    `Enter ${props.label ? props.label.toLowerCase() : 'number'}`,
);

onMounted(() => {
  if (props.useValidator) {
    Object.assign(
      field,
      useField(
        props.fieldName ?? 'numberInput',
        (value: number | undefined) => {
          return setValidatorMessage(value);
        },
      ),
    );
  }

  const initialValue = props.value ?? props.modelValue;
  if (initialValue != null && props.allowEmptyValue) field.value = initialValue;
  else if (!props.allowEmptyValue) field.value = initialValue ?? props.min ?? 0; // Falls back to Zero or Min value when the empty value not allowed
});

const invalidInput = computed(() => props.invalid || !!field.errorMessage);
const inputNumberId = computed(() => {
  if (props.inputId) return props.inputId;

  return (
    (props.label ?? props.fieldName ?? 'input-number')
      .toLowerCase()
      .trim()
      .replaceAll(' ', '-') + '-inputnumber'
  );
});

const setValidatorMessage = async (
  value: number | undefined,
): Promise<string | boolean> => {
  await nextTick();

  // eslint-disable-next-line eqeqeq
  if (props.invalid && typeof props.validatorMessage === 'string') {
    return props.validatorMessage;
  } else if (typeof props.validatorMessage !== 'string') {
    const { empty } = props.validatorMessage ?? {};
    if (value == null && props.mandatory) {
      return empty ?? true;
    } else if (value && props.existingValues?.includes(value)) {
      return props.validatorMessage?.exist ?? props.label + ' sudah ada';
    }
  }
  return true;
};

const onUpdateValue = (
  event: InputNumberInputEvent | number,
  type: 'modelValue' | 'input',
): void => {
  const eventValue =
    type === 'input' ? (event as InputNumberInputEvent).value : event;

  const assignEventValue = (): InputNumberEvent => {
    if (eventValue != null) {
      return eventValue !== '-' ? +eventValue : eventValue;
    }

    return undefined;
  };

  let value: InputNumberEvent = assignEventValue();

  // eslint-disable-next-line eqeqeq
  if (value != null && !isNaN(+value)) {
    // eslint-disable-next-line eqeqeq
    value = eventValue != null ? +eventValue : undefined;
    handleNumberValue(type, value);
    // eslint-disable-next-line eqeqeq
  } else if (value == null && typeof value !== 'string') {
    /*
     * When the value is empty and empty value is not allowed,
     * falls back to min value if exists, zero otherwise
     */
    const emptyOrMinValue = !props.allowEmptyValue
      ? (value ?? props.min ?? 0)
      : value;

    field.value = emptyOrMinValue;

    if (type === 'input') {
      if (!props.allowEmptyValue && inputNumber.value) {
        inputKey.value++;

        nextTick(() => {
          const inputWrapper = inputNumber.value?.[
            '$el' as keyof InputNumber
          ] as HTMLSpanElement;

          const input: HTMLInputElement | null =
            inputWrapper?.querySelector('input');

          input?.focus();
        });
      }

      emit('input', emptyOrMinValue);
    } else {
      emit('update:modelValue', emptyOrMinValue);
    }
  }
};

const handleNumberValue = (
  type: 'modelValue' | 'input',
  value?: number,
): void => {
  const isExceed = typeof value === 'number' ? isExceedMaxDigits(value) : false;

  let slicedValue: number | string | undefined = value
    ?.toString()
    .slice(0, value < 0 ? props.maxDigit + 1 : props.maxDigit);

  // eslint-disable-next-line eqeqeq
  if (slicedValue != null) {
    slicedValue = +(slicedValue ?? 0);
  }

  field.value = isExceed ? +(slicedValue ?? 0) : (value as number | undefined);

  if (isExceed) inputKey.value++;

  if (type === 'input') {
    emit('input', isExceed ? +(slicedValue ?? 0) : value);
  } else {
    emit('update:modelValue', isExceed ? +(slicedValue ?? 0) : value);
  }
};

const isExceedMaxDigits = (value: number | undefined): boolean => {
  return (
    // eslint-disable-next-line eqeqeq
    value != null &&
    value.toString().length > (props.maxDigit > 16 ? 16 : props.maxDigit)
  );
};

const increment = (): void => {
  const currentValue = +(field.value ?? 0);

  onUpdateValue(
    props.max != null && currentValue < props.max
      ? currentValue + 1
      : currentValue,
    'modelValue',
  );
};

const decrement = (): void => {
  const currentValue = +(field.value ?? 0);

  onUpdateValue(
    props.min != null && currentValue > props.min
      ? currentValue - 1
      : currentValue,
    'modelValue',
  );
};

/**
 * We need to watch the props.value changes for async data only once after it rendered.
 */
watch(
  () => props.value,
  (value) => {
    if (!isExceedMaxDigits(value)) {
      field.value = value;
    }
  },
  { once: true },
);

watch(
  () => props.modelValue,
  (model) => {
    if (!isExceedMaxDigits(model)) {
      field.value = model;
    }
  },
);
</script>
<template>
  <FieldWrapper
    :info="fieldInfo"
    :label="props.label"
    :mandatory="props.mandatory"
    :tooltip-pos="tooltipPos"
  >
    <InputGroup
      :class="[
        'grid ',
        {
          'grid-cols-[max-content,1fr,max-content]':
            ($slots['addon-left'] && $slots['addon-right']) || showButtons,
          'grid-cols-[1fr,max-content]':
            !$slots['addon-left'] && $slots['addon-right'],
          'grid-cols-[max-content,1fr]':
            $slots['addon-left'] && !$slots['addon-right'],
        },
        { 'w-max': autoResize },
        inputGroupClass,
      ]"
      :disabled="props.disabled"
      :invalid="invalidInput"
    >
      <InputGroupAddon
        v-if="$slots['addon-left'] || props.showButtons"
        :class="addonLeftClass"
        :disabled="disabled"
        v-bind="InputGroupAddonPreset.root({ props })"
      >
        <slot name="addon-left">
          <Icon
            @click="decrement"
            class="!text-base text-general-500"
            icon="subtract"
          />
        </slot>
      </InputGroupAddon>

      <span
        :class="['relative', { 'w-max': autoResize }]"
        data-wv-section="autoresizeinputwrapper"
      >
        <span
          v-if="autoResize"
          class="text-body-medium !tracking-[0.28px] user-select-none py-1 px-3 inline-block min-w-4 leading-[17px]"
          data-wv-section="inputresizer"
        >
          {{ (field.value ?? '').toString().padStart(padStart, '0') }}
        </span>

        <InputNumber
          :key="inputKey"
          ref="inputNumber"
          v-bind="props"
          :class="[
            inputNumberClass,
            {
              'absolute left-0 top-0 !text-transparent caret-general-800':
                autoResize,
            },
          ]"
          :input-id="inputNumberId"
          :model-value="field.value"
          :placeholder="autoResize ? '' : inputPlaceholder"
          :show-buttons="false"
          @input="onUpdateValue($event, 'input')"
          @update:model-value="onUpdateValue($event, 'modelValue')"
        />
      </span>

      <InputGroupAddon
        v-if="$slots['addon-right'] || props.showButtons"
        :pt="{
          root: InputGroupAddonPreset.root({ props }),
        }"
      >
        <slot name="addon-right">
          <Icon
            @click="increment"
            class="!text-base text-general-500"
            icon="add"
          />
        </slot>
      </InputGroupAddon>
    </InputGroup>
    <ValidatorMessage
      v-if="props.showValidatorMessage"
      :message="field.errorMessage"
    />
  </FieldWrapper>
</template>
