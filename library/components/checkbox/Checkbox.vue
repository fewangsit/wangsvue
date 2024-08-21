<script setup lang="ts">
import type {
  CheckboxProps,
  CheckboxEmits,
  CheckboxModelValue,
} from './Checkbox.vue.d';

import Checkbox from 'primevue/checkbox';
import Icon from '../icon/Icon.vue';
import Preset from 'lib/preset/checkbox';

const props = withDefaults(defineProps<CheckboxProps>(), {
  binary: true,
  selectable: true,
  inputId: 'checkbox',
  withinTable: false,
});

defineEmits<CheckboxEmits>();
const modelValue = defineModel<CheckboxModelValue>('modelValue');
</script>

<template>
  <label
    :class="[
      'flex w-max text-xs font-normal text-grayscale-900 items-center cursor-pointer',
      { 'gap-1': props.label },
      { 'pointer-events-none': !selectable },
    ]"
    data-wv-name="checkbox"
  >
    <Checkbox
      v-bind="$props"
      v-model="modelValue"
      :input-id="inputId"
      :pt="{
        input: { disabled: !selectable || disabled },
      }"
      data-wv-section="checkbox-input"
    >
      <template #icon>
        <Icon
          :class="[...Preset.icon.class, { 'text-transparent': !modelValue }]"
          icon="check"
        />
      </template>
    </Checkbox>

    <span
      class="flex items-start gap-px select-none tracking-[0.02em] leading-none"
      data-wv-section="checkbox-label"
    >
      {{ label }}
      <Icon
        v-if="tooltip"
        :info="tooltip"
        :tooltip-pos="tooltipPos"
        class="w-[10px] h-[10px] text-grayscale-900"
        data-wv-section="tooltip-icon"
        icon="info"
      />
    </span>
  </label>
</template>
