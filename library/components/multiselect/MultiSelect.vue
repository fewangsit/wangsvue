<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useField } from 'vee-validate';

import type {
  MultiSelectEmits,
  MultiSelectProps,
} from 'lib/components/multiselect/MultiSelect.vue.d';

import { OptionValue } from 'lib/types/options.type';
import { FieldValidation } from '../form/Form.vue.d';

import { filterOptions } from 'lib/utils';

import Button from 'lib/components/button/Button.vue';
import MultiSelect from 'primevue/multiselect';
import ValidatorMessage from 'lib/components/validatormessage/ValidatorMessage.vue';
import FieldWrapper from 'lib/components/fieldwrapper/FieldWrapper.vue';
import Icon from 'lib/components/icon/Icon.vue';
import InputGroup from 'lib/components/inputgroup/InputGroup.vue';
import eventBus from 'lib/event-bus';

const props = withDefaults(defineProps<MultiSelectProps>(), {
  display: 'chip',
  filter: true,
  showOptionalText: true,
  filterPlaceholder: 'Cari',
});

const emit = defineEmits<MultiSelectEmits>();

onMounted(() => {
  setValidator();
  eventBus.on('multi-select:hide-overlay', hideOverlay);
});

onUnmounted(() => {
  eventBus.off('multi-select:hide-overlay');
});

const isShowOverlay = ref<boolean>(false);
const multiselect = ref<MultiSelect>();

const field = reactive<FieldValidation<OptionValue[] | undefined>>({
  value: undefined,
});

const visibleOptions = computed(() => filterOptions(props.options));

const multiSelectPlaceholder = computed(() => {
  return props.loading
    ? 'Loading...'
    : (props.placeholder ?? `Pilih ${props.label ?? ''}`);
});

const setValidator = (): void => {
  if (props.useValidator) {
    Object.assign(
      field,
      useField(props.fieldName ?? 'multiSelect', (value: string | number) => {
        const hasValue = Array.isArray(value) && value.length;

        if (!hasValue && props.mandatory) {
          return props.validatorMessage as string | boolean;
        }

        return true;
      }),
    );

    if (props.initialValue?.length) field.value = props.initialValue;
  }
};

/**
 * Method to show the overlay using button trigger.
 *
 * Used when the input should be hidden and controls the multi select overlay from parent component.
 */
const showOverlay = (): void => {
  if (multiselect.value) multiselect.value.show();
};

/**
 * Method to show the overlay using button trigger.
 *
 * Used when the input should be hidden and controls the multi select overlay from parent component.
 */
const hideOverlay = (): void => {
  if (multiselect.value) multiselect.value.hide();
};

const onUpdateValue = (value?: OptionValue[]): void => {
  /**
   * Prevent model value has empty array, it will lead unexpected result of API request.
   */
  const modelValue = value?.length ? value : undefined;
  emit('update:modelValue', modelValue);
};

watch(
  () => field.value,
  () => {
    onUpdateValue(field.value);
  },
);

watch(
  () => props.modelValue,
  (value) => {
    field.value = value;
  },
);

watch(
  () => props.initialValue,
  (value) => {
    field.value = value;
  },
  { once: true },
);

defineExpose({
  isShowOverlay,
  showOverlay,
  hideOverlay,
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
      :class="{ 'rounded-none !ring-0 !w-max': controls }"
      :disabled="props.disabled"
      :invalid="!!field.errorMessage"
    >
      <MultiSelect
        v-bind="props"
        ref="multiselect"
        v-model="field.value"
        :aria-describedby="props.label + 'error'"
        :class="[
          {
            'invisible !w-0': controls,
          },
        ]"
        :display="props.display"
        :max-selected-labels="props.maxSelectedLabels"
        :options="visibleOptions"
        :placeholder="multiSelectPlaceholder"
        :selected-items-label="props.selectedItemsLabel"
        :show-toggle-all="props.filter"
        :virtual-scroller-options="{
          itemSize: 32,
        }"
        @hide="(isShowOverlay = false), $emit('hide')"
        @show="$emit('show'), (isShowOverlay = true)"
      >
        <template
          #value="{ placeholder }"
          v-if="props.fontMediumPlaceholder && !field.value"
        >
          <div class="text-grayscale-800 font-medium">{{ placeholder }}</div>
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

        <template #filtericon>
          <Icon class="text-xs w-6 h-6" icon="search-line" />
        </template>

        <template #removetokenicon="{ removeCallback, item }">
          <Icon
            @click.stop="removeCallback($event, item)"
            class="text-[10px]"
            icon="close"
          />
        </template>

        <template #loadingicon>
          <Icon class="text-xs animate-spin duration-200" icon="spinner" />
        </template>
      </MultiSelect>

      <slot :disabled="props.disabled" name="trigger">
        <Button
          v-if="controls"
          :disabled="props.disabled"
          @click="showOverlay"
          class="!rounded !ring-0"
          icon="add"
        />
      </slot>
    </InputGroup>

    <ValidatorMessage
      :id="props.label + 'error'"
      :message="field.errorMessage"
    />
  </FieldWrapper>
</template>
