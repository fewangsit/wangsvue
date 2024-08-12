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
          $props.invalid,
        '[&_.inputgroupaddon]:ring-general-400': !$props.invalid,
        '!bg-general-50 ': $props.disabled,
      },
      '[&:has(:focus)]:ring-general-500 [&:has(:focus)_.inputgroupaddon]:ring-general-500',
      {
        'ring-[1px] [&_.inputgroupaddon]:ring-[1px]': isFirefoxBased,
        'ring-[0.5px] [&_.inputgroupaddon]:ring-[0.5px]': !isFirefoxBased,
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
