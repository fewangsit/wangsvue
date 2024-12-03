<script setup lang="ts">
import {
  onMounted,
  reactive,
  nextTick,
  computed,
  watch,
  onBeforeMount,
  shallowRef,
  ref,
  inject,
} from 'vue';
import axios from 'axios';

import InputNumber, { InputNumberInputEvent } from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import { FieldValidation } from '../form/Form.vue.d';

import FieldWrapper from '../fieldwrapper/FieldWrapper.vue';
import ValidatorMessage from '../validatormessage/ValidatorMessage.vue';
import Icon from '../icon/Icon.vue';

const Preset = inject<Record<string, any>>('preset', {}).inputphonenumber;

import type {
  InputPhoneNumberProps,
  InputPhoneNumberEmits,
} from './InputPhoneNumber.vue.d';
import { Nullable } from '../ts-helpers';
import { useField } from 'vee-validate';
import getUserLocation from './helpers/getUserLocation.helper';

type DialCode = {
  code: string;
  dial_code: string;
  emoji: string;
  name: string;
};

const props = withDefaults(defineProps<InputPhoneNumberProps>(), {
  maxDigit: 14,
});

const emit = defineEmits<InputPhoneNumberEmits>();

onBeforeMount(async () => {
  dialCodes.value = await getDialCodes();
  selectedDialCode.value = getUserDialCode();
});

onMounted(async () => {
  field.value = props.modelValue;
  if (props.useValidator) {
    Object.assign(
      field,
      useField(
        props.fieldName ?? 'numberInput',
        async (value: Nullable<number>) => {
          return await nextTick(() => setValidatorMessage(value));
        },
      ),
    );
  }
  // eslint-disable-next-line eqeqeq
  if (props.value != null) setValue(props.value);
  // eslint-disable-next-line eqeqeq
  if (props.modelValue != null) setValue(props.modelValue);
});

const invalidInput = computed(() => props.invalid || !!field.errorMessage);
const isFirefoxBased = navigator.userAgent.includes('Firefox');

const setValidatorMessage = (value: Nullable<number>): string | boolean => {
  if (props.invalid && props.validatorMessage) {
    return props.validatorMessage;
  } else if (value == null && props.mandatory) {
    return props.validatorMessage ?? `${props.label} harus diisi.`;
  }

  return true;
};

const dialCodes = shallowRef<DialCode[]>();
const selectedDialCode = shallowRef();
const rawValue = shallowRef<number>();

const phoneKey = shallowRef<number>(0);

const field = reactive<FieldValidation<Nullable<string>>>({ value: null });

const getDialCodes = async (): Promise<DialCode[]> => {
  const { data } = await axios.get(
    'https://assets.tagsamurai.com/json/country-dial-code.json',
  );
  return data.filter((d: DialCode) => d.dial_code) ?? []; // Some dial_code(s) is missing
};

const grabValue = (data?: InputNumberInputEvent): void => {
  rawValue.value = data?.value as number;
  updateValue();
};

const updateValue = (): void => {
  field.value = rawValue.value
    ? `${selectedDialCode.value} ${rawValue.value}`
    : undefined;
  emit('update:modelValue', field.value);
};
/**
 * Focusing input number after user select dial code
 */
const focusInput = (): void => {
  nextTick(() => {
    const input = document.getElementById(
      'phone-number-input',
    ) as HTMLInputElement | null;

    if (input) input.focus();
  });
};

const setValue = (model?: string): void => {
  const values = model?.split(' ');
  if (values?.length) {
    selectedDialCode.value = values[0];
    rawValue.value = parseInt(values[1]);
    field.value = rawValue.value
      ? `${selectedDialCode.value} ${rawValue.value}`
      : undefined;
  } else {
    field.value = undefined;
  }
};

const getUserDialCode = (): string => {
  if (dialCodes.value) {
    const { country } = getUserLocation();
    const foundDial = dialCodes.value.find((dial) => dial.name === country);

    if (foundDial) return foundDial.dial_code;
    return '+62';
  }

  return '+62';
};

const setMaxValue = (value: number): void => {
  rawValue.value = parseInt(String(value).slice(0, 15));
  updateValue();
  phoneKey.value++;
};

const getDigits = (phoneNumber?: number): number =>
  typeof phoneNumber === 'number' ? phoneNumber.toString().length : 0;

/**
 * We need to watch the props.value changes for async data only once after it rendered.
 */
watch(
  () => props.value,
  (value) => {
    setValue(value);
  },
  { once: true },
);

watch(
  () => props.modelValue,
  (model) => {
    setValue(model);
  },
);

watch(rawValue, (val) => {
  const digits = getDigits(val);
  if (digits > 15) {
    setMaxValue(val as number);
  }
});
</script>

<template>
  <FieldWrapper
    :info="props.fieldInfo"
    :label="props.label"
    :mandatory="props.mandatory"
  >
    <div
      class="grid grid-cols-[max-content,auto] w-full"
      data-wv-section="phone-number-input-wrapper"
    >
      <Dropdown
        v-model="selectedDialCode"
        :class="Preset?.dialcode({ isFirefoxBased, invalidInput }).class"
        :disabled="props.disabled"
        :filter-fields="['dial_code', 'name']"
        :options="dialCodes"
        @change="updateValue"
        @hide="focusInput"
        data-wv-section="dialcode"
        filter
        filter-placeholder="Search"
        option-label="dial_code"
        option-value="dial_code"
      >
        <template #dropdownicon>
          <Icon
            class="w-full h-full transition-transform"
            icon="arrow-drop-down"
          />
        </template>
        <template #option="{ option }">
          <div class="flex gap-2">
            <img :src="option.image" alt="country-img" style="height: 16px" />
            <span>{{ option.name }}</span>
            <span>{{ option.dial_code }}</span>
          </div>
        </template>
      </Dropdown>

      <InputNumber
        :key="phoneKey"
        v-bind="$props"
        v-model="rawValue"
        :class="Preset?.inputnumber({ isFirefoxBased, invalidInput }).class"
        :disabled="props.disabled"
        :use-grouping="false"
        @input="grabValue"
        data-wv-section="inputnumber"
        input-id="phone-number-input"
        placeholder="Enter phone number"
      />
    </div>

    <ValidatorMessage
      v-show="field.errorMessage"
      :message="field.errorMessage"
    />
  </FieldWrapper>
</template>
