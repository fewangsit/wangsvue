<script setup lang="ts">
import Icon from '../icon/Icon.vue';
import type { FieldWrapperProps } from './FieldWrapper.vue.d';

withDefaults(defineProps<FieldWrapperProps>(), {
  showOptionalText: true,
  tooltipPos: 'top',
});
</script>

<template>
  <div
    class="flex flex-col items-start justify-start relative gap-1 w-full shrink-0 overflow-hidden"
    data-wv-name="field-wrapper"
    data-wv-section="root"
  >
    <label
      v-if="label"
      :class="[
        'text-general-900  text-xs flex gap-[2px] font-normal',
        labelClass,
      ]"
      data-wv-section="field-label"
    >
      {{ label }}
      <span
        v-if="mandatory == false && showOptionalText"
        class="text-grayscale-700 text-[10px] font-normal leading-4"
      >
        (opsional)
      </span>
      <Icon
        v-if="info"
        :info="info"
        :tooltip-pos="tooltipPos"
        class="w-2.5 h-2.5 text-grayscale-900"
        icon="info"
      />
    </label>
    <slot />
  </div>
</template>
