<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useField } from 'vee-validate';

import type {
  DropdownEmits,
  DropdownProps,
} from 'lib/components/dropdown/Dropdown.vue.d';

import { OptionValue } from 'lib/types/options.type';
import { FieldValidation } from '../form/Form.vue.d';

import ValidatorMessage from 'lib/components/validatormessage/ValidatorMessage.vue';
import Dropdown, { DropdownChangeEvent } from 'primevue/dropdown';
import FieldWrapper from 'lib/components/fieldwrapper/FieldWrapper.vue';
import Icon from 'lib/components/icon/Icon.vue';
import InputGroup from 'lib/components/inputgroup/InputGroup.vue';
import InputGroupAddon from 'primevue/inputgroupaddon';
import { filterOptions } from 'lib/utils';
import { Nullable } from '../ts-helpers';

const props = withDefaults(defineProps<DropdownProps>(), {
  filter: true,
  filterPlaceholder: 'Cari',
  modelValue: undefined,
  formatValidatorMessage: true,
});

const emit = defineEmits<DropdownEmits>();

onMounted(() => {
  setValidator();
});

const isShowOverlay = ref<boolean>(false);

const invalidInput = computed(() => props.invalid || !!field.errorMessage);

const field = reactive<FieldValidation<Nullable<OptionValue>>>({
  value: props.initialValue ? props.initialValue : props.modelValue,
});

const visibleOptions = computed(() => filterOptions(props.options));

const dropdownPlaceholder = computed(() => {
  return props.loading
    ? 'Loading...'
    : (props.placeholder ?? `Pilih ${props.label ?? ''}`);
});

const setValidator = (): void => {
  if (props.useValidator) {
    Object.assign(
      field,
      useField(props.fieldName ?? 'dropdown', (value: string | number) => {
        /*
         * '!=' checks wether the value is undefined or null
         * Because `undefined == null` but `undefined !== null`
         */
        // eslint-disable-next-line eqeqeq
        const hasValue = value != null && value !== '';

        if (!hasValue && props.mandatory) {
          return props.validatorMessage as string | boolean;
        }

        return setValidatorMessage();
      }),
    );

    if (props.initialValue) field.value = props.initialValue;
  }
};

const setValidatorMessage = async (): Promise<boolean | string> => {
  await nextTick();

  if (props.validatorMessage && props.invalid) {
    return props.validatorMessage as string;
  }

  return true;
};

const updateFieldValue = (event: DropdownChangeEvent): void => {
  const { value } = event;
  emit('update:modelValue', value);
};

watch(
  () => props.initialValue,
  (value) => {
    field.value = value;
  },
  { once: true },
);

watch(
  () => props.modelValue,
  (value) => {
    field.value = value;
  },
);
</script>

<template>
  <FieldWrapper
    :info="fieldInfo"
    :label="props.label"
    :mandatory="props.mandatory"
  >
    <InputGroup
      :class="[
        {
          'grid grid-cols-[max-content,1fr,max-content]':
            $slots['addon-left'] && $slots['addon-right'],
          'grid grid-cols-[1fr,max-content]':
            !$slots['addon-left'] && $slots['addon-right'],
          'grid grid-cols-[max-content,1fr]':
            $slots['addon-left'] && !$slots['addon-right'],
        },
      ]"
      :disabled="props.disabled"
      :invalid="invalidInput"
    >
      <InputGroupAddon v-if="$slots['addon-left']" :disabled="props.disabled">
        <slot name="addon-left" />
      </InputGroupAddon>

      <Dropdown
        v-bind="props"
        v-model="field.value"
        :aria-describedby="props.label + 'error'"
        :invalid="invalidInput"
        :options="visibleOptions"
        :placeholder="dropdownPlaceholder"
        @change="updateFieldValue"
        @hide="isShowOverlay = false"
        @show="$emit('show'), (isShowOverlay = true)"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex align-items-center">
            {{ slotProps.value }}
          </div>
          <template v-else>
            {{ slotProps.placeholder }}
          </template>
        </template>
        <template #dropdownicon>
          <Icon
            :class="[
              'w-full h-full transition-transform !text-general-500',
              { 'rotate-180': isShowOverlay },
            ]"
            icon="arrow-drop-down"
          />
        </template>

        <template #loadingicon>
          <Icon class="text-xs animate-spin duration-200" icon="spinner" />
        </template>

        <template #option="{ option }" v-if="$slots['option']">
          <slot :option="option" name="option" />
        </template>

        <template #filtericon>
          <Icon class="text-xs w-6 h-6" icon="search-line" />
        </template>
      </Dropdown>

      <InputGroupAddon
        v-if="$slots['addon-right']"
        :class="{
          '!text-general-200 !dark:text-general-200': props.disabled,
        }"
      >
        <slot name="addon-right" />
      </InputGroupAddon>
    </InputGroup>
    <ValidatorMessage
      :id="props.label + 'error'"
      :message="field.errorMessage"
    />
  </FieldWrapper>
</template>
