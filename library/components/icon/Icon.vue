<script setup lang="ts">
import { shallowRef } from 'vue';
import type {
  WangsIcons,
  WangsIconseverities,
} from 'lib/components/icon/Icon.vue.d';

const props = withDefaults(
  defineProps<{
    icon: WangsIcons;
    severity?: WangsIconseverities;
    /**
     * Show info on hover.
     */
    info?: string;
    /**
     * Set the position of tooltip.
     */
    tooltipPos?: 'top' | 'right' | 'bottom' | 'left';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    class?: any;
  }>(),
  {
    severity: undefined,
    info: undefined,
    tooltipPos: 'top',
    class: undefined,
  },
);

const severityClass = ((): string => {
  switch (props.severity) {
    case 'primary':
      return 'text-primary-500';
    case 'success':
      return 'text-success-500';
    case 'warning':
      return 'text-warning-500';
    case 'danger':
      return 'text-danger-500';
    case 'info':
      return 'text-info-500';
    default:
      return 'inherit';
  }
})();

const classes = shallowRef([
  'icon',
  `ic-${props.icon}`,
  severityClass,
  'cursor-pointer',
]);
</script>
<template>
  <i
    v-if="tooltipPos === 'top'"
    v-tooltip.top="info"
    v-bind="$attrs"
    :class="[...classes, $props['class']]"
  />
  <i
    v-if="tooltipPos === 'bottom'"
    v-tooltip.bottom="info"
    v-bind="$attrs"
    :class="[...classes, $props['class']]"
  />
  <i
    v-if="tooltipPos === 'right'"
    v-tooltip.right="info"
    v-bind="$attrs"
    :class="[...classes, $props['class']]"
  />
  <i
    v-if="tooltipPos === 'left'"
    v-tooltip.left="info"
    v-bind="$attrs"
    :class="[...classes, $props['class']]"
  />
</template>
