<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useField } from 'vee-validate';
import Badge from 'lib/components/badge/Badge.vue';

import type {
  DropdownEmits,
  DropdownProps,
} from 'lib/components/dropdown/Dropdown.vue.d';

import { DropdownOption, OptionValue } from 'lib/types/options.type';
import { FieldValidation } from '../form/Form.vue.d';

import ValidatorMessage from 'lib/components/validatormessage/ValidatorMessage.vue';
import Dropdown, { DropdownChangeEvent } from 'primevue/dropdown';
import FieldWrapper from 'lib/components/fieldwrapper/FieldWrapper.vue';
import Icon from 'lib/components/icon/Icon.vue';
import InputGroup from 'lib/components/inputgroup/InputGroup.vue';
import InputGroupAddon from 'primevue/inputgroupaddon';
import { Nullable } from '../ts-helpers';
import { filterOptions } from 'lib/utils';
import Preset from 'lib/preset/dropdown';

const props = withDefaults(defineProps<DropdownProps>(), {
  filter: true,
  filterPlaceholder: 'Cari',
  modelValue: undefined,
  formatValidatorMessage: true,
  valueType: 'plain',
  showOptionalText: true,
});

const emit = defineEmits<DropdownEmits>();

onMounted(() => {
  setValidator();
});

const dropdown = ref<Dropdown>();
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

const getOptionLabel = (): string => {
  if (props.optionValue) {
    const matchOption = visibleOptions.value.find((op) => {
      if (typeof op != 'string') {
        return (
          op[(props.optionValue ?? '') as keyof DropdownOption] ===
          (field.value as string)
        );
      }
    });

    if (matchOption && typeof matchOption != 'string') {
      return matchOption[
        (props.optionLabel ?? '') as keyof DropdownOption
      ] as string;
    }
  } else if (
    field.value &&
    typeof field.value === 'object' &&
    props.optionLabel &&
    props.optionLabel in field.value
  ) {
    return field.value[props.optionLabel] as string;
  }

  return field.value as string;
};

/**
 * Method to show the overlay with template ref.
 */
const showOverlay = (): void => {
  if (dropdown.value) dropdown.value.show();
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

defineExpose({
  showOverlay,
});
</script>

<template>
  <FieldWrapper
    :info="fieldInfo"
    :label="props.label"
    :mandatory="props.mandatory"
    :show-optional-text="showOptionalText"
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
      :ring="inputBorder"
    >
      <InputGroupAddon v-if="$slots['addon-left']" :disabled="props.disabled">
        <slot name="addon-left" />
      </InputGroupAddon>

      <Dropdown
        ref="dropdown"
        v-bind="props"
        v-model="field.value"
        :aria-describedby="props.label + 'error'"
        :invalid="invalidInput"
        :options="visibleOptions"
        :placeholder="dropdownPlaceholder"
        :pt="{
          wrapper: Preset.wrapper({ props }),
        }"
        @change="updateFieldValue"
        @hide="isShowOverlay = false"
        @show="$emit('show'), (isShowOverlay = true)"
      >
        <template #value="slotProps">
          <template v-if="slotProps.value">
            <slot :value="getOptionLabel()" name="value">
              <Badge
                v-if="valueType === 'badge'"
                v-bind="badgeValueProps"
                :label="getOptionLabel()"
              />
              <div v-else class="flex items-center">
                {{ getOptionLabel() }}
              </div>
            </slot>
          </template>
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
