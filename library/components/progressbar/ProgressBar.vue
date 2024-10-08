<script setup lang="ts">
import ProgressBar from 'primevue/progressbar';
import { ProgressBarProps } from './ProgressBar.vue.d';
import Preset from 'lib/preset/wangsvue/progressbar';

const props = withDefaults(defineProps<ProgressBarProps>(), {
  mode: 'determinate',
  severity: 'primary',
  showValue: true,
});
</script>

<template>
  <div
    data-wv-name="progressbar"
    data-wv-section="root"
    v-bind="Preset.wrapper"
  >
    <ProgressBar
      v-bind="props"
      :pt="{ value: Preset.value({ props }) }"
      :show-value="false"
    />

    <span
      v-if="showValue"
      v-bind="Preset['progressbar-value']"
      data-wv-section="progressbar-value"
    >
      {{ value }}%
    </span>
  </div>
</template>
