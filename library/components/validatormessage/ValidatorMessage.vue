<script setup lang="ts">
import type { ValidatorMessageProps } from './ValidatorMessage.vue.d';

defineProps<ValidatorMessageProps>();
</script>
<template>
  <small
    v-show="message"
    class="!mt-0 text-danger-500-500 text-xs font-light"
    data-wv-section="validator-message"
    role="alert"
  >
    {{ message }}
  </small>
</template>
