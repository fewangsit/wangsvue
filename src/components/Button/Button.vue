<script setup lang="ts">
import { shallowRef, useAttrs } from 'vue';
import { toArrayClass } from '@/components/helpers';

import Icon from '@/components/Icon/Icon.vue';
import PrimeButton from 'primevue/button';
import type { TSButtonProps } from './Button.vue.d';
import Preset from '@/preset/button';

const props = defineProps<TSButtonProps>();
const attrs = useAttrs();

const iconProps = shallowRef({
  icon: props.icon ?? 'check',
  class: [
    ...Preset.icon({ props: attrs }).class,
    { 'text-base': props.icon && !(props.label || attrs['label']) }, // Need to use attrs, because props.label is always undefined.
    ...toArrayClass(props.iconClass),
  ],
});
</script>

<template>
  <PrimeButton
    v-if="tooltipPos === 'top'"
    v-tooltip.top="tooltip"
    v-bind="$attrs"
    :icon="icon"
    :icon-pos="iconPos"
  >
    <template #icon>
      <Icon v-if="icon" v-bind="iconProps" />
    </template>
    <slot />
  </PrimeButton>

  <PrimeButton
    v-else-if="tooltipPos === 'left'"
    v-tooltip.left="tooltip"
    v-bind="$attrs"
    :icon="icon"
    :icon-pos="iconPos"
  >
    <template #icon>
      <Icon v-if="icon" v-bind="iconProps" />
    </template>
    <slot />
  </PrimeButton>

  <PrimeButton
    v-else-if="tooltipPos === 'right'"
    v-tooltip.right="tooltip"
    v-bind="$attrs"
    :icon="icon"
    :icon-pos="iconPos"
  >
    <template #icon>
      <Icon v-if="icon" v-bind="iconProps" />
    </template>
    <slot />
  </PrimeButton>

  <PrimeButton
    v-else
    v-tooltip.bottom="tooltip"
    v-bind="$attrs"
    :icon="icon"
    :icon-pos="iconPos"
  >
    <template #icon>
      <Icon v-if="icon" v-bind="iconProps" />
    </template>
    <slot />
  </PrimeButton>
</template>
