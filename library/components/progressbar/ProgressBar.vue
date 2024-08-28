<script setup lang="ts">
import ProgressBar, { ProgressBarProps } from 'primevue/progressbar';
import { BadgeProps } from '../badge/Badge.vue.d';
import Preset from 'lib/preset/progressbar';

const props = defineProps<
  ProgressBarProps & {
    severity: BadgeProps['severity'];
  }
>();
</script>

<template>
  <ProgressBar v-bind="props" :pt="{ value: Preset.value({ props }) }" />
</template>
