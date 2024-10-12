<script setup lang="ts">
import { inject } from 'vue';
import type { ValidatorMessageProps } from './ValidatorMessage.vue.d';

defineProps<ValidatorMessageProps>();

const Preset = inject<Record<string, any>>('preset', {}).validatormessage;
</script>
<template>
  <small
    v-show="message"
    v-bind="Preset?.root"
    data-wv-section="validator-message"
    role="alert"
  >
    {{ message }}
  </small>
</template>
