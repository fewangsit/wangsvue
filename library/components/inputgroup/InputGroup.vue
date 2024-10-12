<script setup lang="ts">
import { inject } from 'vue';
import { InputGroupProps } from './InputGroup.vue.d';

import InputGroup from 'primevue/inputgroup';

defineProps<InputGroupProps>();

const Preset = inject<Record<string, any>>('preset', {}).inputgroup;

const focusToInput = (e: MouseEvent): void => {
  const target = e.target as HTMLElement;
  if (target) {
    const el = target.querySelector('input') as HTMLInputElement;

    el?.focus();
  }
};
</script>

<template>
  <InputGroup
    :pt="{
      root: Preset.root({ props: { ...$props, class: $attrs['class'] } }),
    }"
    @click="focusToInput"
  >
    <slot />
  </InputGroup>
</template>
