<script setup lang="ts">
import InputText from '../inputtext/InputText.vue';
import type { InputURLEmits, InputURLProps } from './InputURL.vue.d';

const props = withDefaults(defineProps<InputURLProps>(), {
  useValidator: true,
  useProtocol: true,
});

const emit = defineEmits<InputURLEmits>();
</script>
<template>
  <InputText
    @update:model-value="emit('update:modelValue', $event)"
    v-bind="props"
    type="url"
  >
    <template #addon-left v-if="$slots['addon-left']">
      <slot name="addon-left" />
    </template>
    <template #addon-right v-if="$slots['addon-right']">
      <slot name="addon-right" />
    </template>
  </InputText>
</template>
