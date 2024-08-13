<script setup lang="ts">
import InputText from '../inputtext/InputText.vue';
import type { InputEmailEmits, InputEmailProps } from './InputEmail.vue.d';
import { Nullable } from '../ts-helpers';

defineProps<InputEmailProps>();
defineEmits<InputEmailEmits>();
</script>
<template>
  <InputText
    :field-info="fieldInfo"
    :field-name="fieldName"
    :input-class="inputClass"
    :input-container-class="inputContainerClass"
    :label="label"
    :label-class="labelClass"
    :mandatory="mandatory"
    :manual-invalid-container="manualInvalidContainer"
    :model-value="modelValue"
    :placeholder="placeholder"
    :use-validator="useValidator"
    :validator-message="validatorMessage"
    :validator-message-class="validatorMessageClass"
    @blur="(event: unknown) => $emit('blur', event as Nullable<string>)"
    @update:model-value="$emit('update:modelValue', $event)"
    type="email"
  />
</template>
