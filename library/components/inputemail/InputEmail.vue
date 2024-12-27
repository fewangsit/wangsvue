<script setup lang="ts">
import InputText from '../inputtext/InputText.vue';
import { Nullable } from '../ts-helpers';
import type { InputEmailEmits, InputEmailProps } from './InputEmail.vue.d';

defineProps<InputEmailProps>();
defineEmits<InputEmailEmits>();
</script>
<template>
  <InputText
    @blur="(event: unknown) => $emit('blur', event as Nullable<string>)"
    @input="(event: unknown) => $emit('input', event as Nullable<string>)"
    @update:model-value="$emit('update:modelValue', $event)"
    v-bind="$props"
    type="email"
  />
</template>
