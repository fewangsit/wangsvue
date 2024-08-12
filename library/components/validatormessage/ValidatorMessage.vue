<script setup lang="ts">
import type { ValidatorMessageProps } from './ValidatorMessage.vue.d';

const props = withDefaults(defineProps<ValidatorMessageProps>(), {
  message: undefined,
  format: true,
});

const formatMessage = (): string => {
  const firstChar = props.message?.[0];

  return (
    (firstChar?.toUpperCase() ?? '') +
    (props.message?.toLowerCase()?.slice(1) ?? '')
  );
};
</script>
<template>
  <small
    v-show="message"
    class="!mt-0 text-danger-500 dark:text-danger-500 text-xs font-light"
    data-pc-section="validator-message"
  >
    {{ format ? formatMessage() : message }}
  </small>
</template>
