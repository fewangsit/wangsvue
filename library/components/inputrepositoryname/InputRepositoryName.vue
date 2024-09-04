<script setup lang="ts">
import InputText from '../inputtext/InputText.vue';
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
  const splittedName =
    name
      ?.trim()
      ?.toLowerCase()
      ?.split(/[/_ ]+/) ?? [];
  model.value = splittedName?.join('-') ?? '';
};

const handleUpdate = (event?: string): void => {
  formattingRepositoryName(event);
  emit('update:modelValue', model.value);
};
</script>
<template>
  <InputText
    v-bind="props"
    v-model="model"
    @update:model-value="handleUpdate"
    type="repositoryname"
  />
</template>
