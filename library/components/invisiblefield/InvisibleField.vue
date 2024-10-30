<script setup lang="ts">
import { useField } from 'vee-validate';
import { onMounted, reactive, watch } from 'vue';
import { FieldValidation } from '../form/Form.vue.d';
import { Nullable } from '../ts-helpers';

type FieldValue =
  | Nullable<string>
  | Nullable<number>
  | string
  | string[]
  | number
  | number[]
  | boolean
  | undefined
  | null
  | object;

const props = withDefaults(
  defineProps<{
    value?: FieldValue;
    fieldName?: string;
  }>(),
  {
    value: undefined,
    fieldName: 'invisibleinput',
  },
);

const field = reactive<FieldValidation<FieldValue>>({
  value: typeof props.value === 'string' ? props.value?.trim() : props.value,
});

onMounted(() => {
  Object.assign(field, useField(props.fieldName ?? 'invisibleinput'));

  // eslint-disable-next-line eqeqeq
  if (props.value != null)
    field.value =
      typeof props.value === 'string' ? props.value?.trim() : props.value;
});

watch(
  () => props.value,
  (newValue) => {
    field.value = newValue;
  },
);
</script>

<template>
  <div class="!hidden" />
</template>
