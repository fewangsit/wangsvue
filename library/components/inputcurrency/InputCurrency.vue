<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onMounted,
  reactive,
  shallowRef,
  watch,
} from 'vue';
import InputNumber from '../inputnumber/InputNumber.vue';
import Dropdown from 'primevue/dropdown';
import Icon from '../icon/Icon.vue';

import currencies from 'lib/assets/json/currencies.json';

import type {
  CurrencyValue,
  InputCurrencyEmits,
  InputCurrencyProps,
  CurrencyFormat,
} from './InputCurrency.vue.d';

import { useField } from 'vee-validate';
import { FieldValidation } from 'lib/components/form/Form.vue.d';
import { getCurrency } from 'lib/components/inputcurrency/helpers/currency.helper';

const props = defineProps<InputCurrencyProps>();
const emit = defineEmits<InputCurrencyEmits>();

onMounted(() => {
  if (props.useValidator) {
    Object.assign(
      field,
      useField(props.fieldName ?? 'currencyInput', (value?: CurrencyValue) => {
        if (!value?.value && props.mandatory) {
          return `${props.label} must not be empty`;
        }

        return true;
      }),
    );

    if (props.modelValue) field.value = props.modelValue;
  }
});

const { dropdown: DropdownPreset = {}, inputcurrency: Preset = {} } = inject<
  Record<string, any>
>('preset', {});

const isShowOverlay = shallowRef<boolean>(false);
const numberInput = shallowRef<number | undefined>(props.modelValue?.value);
const isFirefoxBased = navigator.userAgent.includes('Firefox');
const selectedCurrency = shallowRef<CurrencyFormat>(
  getCurrency(props.modelValue?.currency),
);

const field = reactive<FieldValidation<CurrencyValue | undefined>>({
  value: props.modelValue,
});

const currencyOptions = shallowRef<CurrencyFormat[]>(currencies);

const locale = computed(() => selectedCurrency.value?.locale);
const inputNumberId = computed(() => {
  if (props.inputnNumberId) return props.inputnNumberId;

  return (
    (props.label ?? props.fieldName ?? 'input-number')
      .toLowerCase()
      .trim()
      .replaceAll(' ', '-') + '-inputnumber'
  );
});

const invalidInput = computed(() => props.invalid || !!field.errorMessage);

const updateFieldValue = (
  { currency }: CurrencyFormat,
  value?: number,
): void => {
  const fieldValue = { currency, value };
  emit('update:modelValue', fieldValue);
  field.value = fieldValue;
};

/**
 * Focusing input number after user select dial code
 */
const focusInput = (): void => {
  nextTick(() => {
    const input = document.getElementById(
      inputNumberId.value,
    ) as HTMLInputElement | null;

    if (input) input.focus();
  });
};

watch(
  () => props.modelValue,
  () => {
    selectedCurrency.value = props.modelValue?.currency
      ? getCurrency(props.modelValue?.currency)
      : selectedCurrency.value;
    field.value = props.modelValue;
    numberInput.value = props.modelValue?.value;
  },
);
</script>
<template>
  <InputNumber
    v-bind="props"
    v-model="numberInput"
    :input-id="inputNumberId"
    :input-number-class="Preset.value({ isFirefoxBased, invalidInput }).class"
    :locale="locale"
    :min-fraction-digits="0"
    :use-validator="false"
    @update:model-value="updateFieldValue(selectedCurrency, $event)"
    addon-left-class="!p-0 !bg-transparent"
    input-group-class="!ring-0"
    mode="decimal"
    use-grouping
  >
    <template #addon-left>
      <Dropdown
        v-model="selectedCurrency"
        :class="Preset.currency({ isFirefoxBased, invalidInput }).class"
        :filter-fields="['label', 'currency']"
        :options="currencyOptions"
        :pt="{
          input: {
            class: [
              'py-1 pl-3 pr-2',
              DropdownPreset.input({ props: { modelValue: selectedCurrency } })
                .class,
            ],
          },
        }"
        @hide="(isShowOverlay = false), focusInput()"
        @show="isShowOverlay = true"
        @update:model-value="updateFieldValue($event, numberInput)"
        data-key="currency"
        filter
        filter-placeholder="Search"
        option-label="symbol"
      >
        <template #dropdownicon>
          <Icon
            :class="[
              'w-full h-full transition-transform !text-general-500',
              { 'rotate-180': isShowOverlay },
            ]"
            icon="arrow-drop-down"
          />
        </template>

        <template #option="{ option }">
          {{ option.label }}
        </template>
      </Dropdown>
    </template>
  </InputNumber>
</template>
