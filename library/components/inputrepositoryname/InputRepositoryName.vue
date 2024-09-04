<script setup lang="ts">
import InputText from '../inputtext/InputText.vue';
import { Nullable } from '../ts-helpers';
import type {
  InputRepositoryNameEmits,
  InputRepositoryNameProps,
} from './InputRepositoryName.vue.d';

const props = withDefaults(defineProps<InputRepositoryNameProps>(), {
  useValidator: true,
});

const emit = defineEmits<InputRepositoryNameEmits>();

const model = defineModel<string>('model');

const formattingRepositoryName = (name?: string): void => {
  const splittedName = name?.trim()?.toLowerCase()?.split(/[/ ]+/) ?? [];
  model.value = splittedName?.join('-') ?? '';
};

const handleInput = (event?: Nullable<string>): void => {
  formattingRepositoryName(event);
  emit('update:modelValue', model.value);
};

const handleUpdate = (event: string): void => {
  formattingRepositoryName(event);
  emit('update:modelValue', model.value);
};
</script>
<template>
  <InputText
    v-model="model"
    @input="(e: unknown) => handleInput(e as Nullable<string>)"
    @update:model-value="handleUpdate"
    v-bind="props"
    type="repositoryname"
  />
</template>
