<script setup lang="ts">
import { computed, inject } from 'vue';
import { ProgressBarProps } from './ProgressBar.vue.d';

const Preset = inject<Record<string, any>>('preset', {}).progressbar;

const props = withDefaults(defineProps<ProgressBarProps>(), {
  mode: 'determinate',
  severity: 'primary',
  showValue: true,
  valuePosition: 'right-side',
});

const determinate = computed(() => props.mode === 'determinate');
const indeterminate = computed(() => props.mode === 'indeterminate');
const inside = computed(() => props.valuePosition === 'inside');
</script>

<template>
  <div
    v-bind="Preset.root({ props })"
    :aria-valuenow="value"
    aria-valuemax="100"
    aria-valuemin="0"
    role="progressbar"
  >
    <div v-bind="Preset.container({ props })">
      <div
        v-if="determinate"
        v-bind="Preset.value({ props })"
        :style="`width: ${value ?? 0}%`"
      >
        <div
          v-if="value != null && value !== 0 && showValue && inside"
          v-bind="Preset.label({ props })"
        >
          <slot name="label">{{ value + '%' }}</slot>
        </div>
      </div>

      <div v-if="indeterminate" v-bind="Preset.container({ props })">
        <div v-bind="Preset.value" />
      </div>
    </div>

    <span
      v-if="showValue && !inside && determinate"
      v-bind="Preset.label({ props })"
    >
      <slot name="label">{{ value + '%' }}</slot>
    </span>
  </div>
</template>
