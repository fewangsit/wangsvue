<script setup lang="ts">
import { shallowRef } from 'vue';
import type {
  TSVueIcons,
  TSVueIconSeverities,
} from 'lib/components/icon/Icon.vue.d';

const props = withDefaults(
  defineProps<{
    icon: TSVueIcons;
    severity?: TSVueIconSeverities;
    /**
     * Show info on hover.
     */
    info?: string;
    /**
     * Set the position of tooltip.
     */
    tooltipPos?: 'top' | 'right' | 'bottom' | 'left';
  }>(),
  {
    severity: undefined,
    info: undefined,
    tooltipPos: 'top',
  },
);

const classes = shallowRef([
  'icon',
  `ic-${props.icon}`,
  `text-${props.severity ?? 'inherit'}`,
  'cursor-pointer',
]);
</script>
<template>
  <i
    v-if="tooltipPos === 'top'"
    v-tooltip.top="info"
    v-bind="$attrs"
    :class="[...classes, $attrs['class']]"
  />
  <i
    v-if="tooltipPos === 'bottom'"
    v-tooltip.bottom="info"
    v-bind="$attrs"
    :class="[...classes, $attrs['class']]"
  />
  <i
    v-if="tooltipPos === 'right'"
    v-tooltip.right="info"
    v-bind="$attrs"
    :class="[...classes, $attrs['class']]"
  />
  <i
    v-if="tooltipPos === 'left'"
    v-tooltip.left="info"
    v-bind="$attrs"
    :class="[...classes, $attrs['class']]"
  />
</template>
