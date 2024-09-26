<script setup lang="ts">
import InputGroup from 'primevue/inputgroup';
import { InputGroupProps } from './InputGroup.vue.d';

defineProps<InputGroupProps>();

/**
 * To set different ring width for Firefox Browser
 * Also for InputGroupAddon
 */
const isFirefoxBased = navigator.userAgent.includes('Firefox');

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
    :class="[
      {
        '!ring-danger-500 !dark:ring-danger-500 [&_.inputgroupaddon]:ring-danger-500 [&_.inputgroupaddon]:dark:ring-danger-500':
          $props.invalid && ring != 'none',
        '[&_.inputgroupaddon]:ring-general-400':
          !$props.invalid && ring != 'none',
        '!bg-general-50 ': $props.disabled,
      },
      {
        '[&:has(:focus)]:!ring-primary-400 [&:has(:focus)_.inputgroupaddon]:!ring-primary-400':
          ring != 'none',
      },
      {
        'ring-[1px] [&_.inputgroupaddon]:ring-[1px]':
          isFirefoxBased && ring != 'none',
        'ring-[0.5px] [&_.inputgroupaddon]:ring-[0.5px]':
          !isFirefoxBased && ring != 'none',
      },
      '[&:has(input)]:cursor-text',
      'h-[30px]',
      $attrs['class'],
    ]"
    @click="focusToInput"
  >
    <slot />
  </InputGroup>
</template>
