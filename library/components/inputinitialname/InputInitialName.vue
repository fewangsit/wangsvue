<script setup lang="ts">
import { computed, watch } from 'vue';
import InputText from '../inputtext/InputText.vue';
import { Nullable } from '../ts-helpers';
import type {
  InputInitialNameEmits,
  InputInitialNameProps,
} from './InputInitialName.vue.d';
import { getInititalName } from 'lib/utils';

const props = defineProps<InputInitialNameProps>();
const emit = defineEmits<InputInitialNameEmits>();

const model = computed({
  get() {
    return props.modelValue?.toUpperCase();
  },
  set(value: string | null) {
    emit('update:modelValue', value?.toUpperCase());
  },
});

const isExist = computed(() => {
  return props.existingInitialNames?.includes(model.value);
});

const errorMessage = computed(() => {
  if (isExist.value) return 'Inisial nama sudah ada';
  return {
    empty: 'Inisial nama tidak boleh kosong',
  };
});

watch(
  () => props.fullName,
  () => {
    model.value =
      getInititalName(props.existingInitialNames, props.fullName) || null;
  },
  {
    immediate: true,
  },
);
</script>
<template>
  <InputText
    v-model="model"
    :field-info="fieldInfo"
    :field-name="fieldName"
    :input-class="inputClass"
    :input-container-class="inputContainerClass"
    :invalid="isExist"
    :label="label"
    :label-class="labelClass"
    :manual-invalid-container="manualInvalidContainer"
    :placeholder="placeholder"
    :use-validator="true"
    :validator-message="errorMessage"
    :validator-message-class="validatorMessageClass"
    @blur="(event: unknown) => $emit('blur', event as Nullable<string>)"
    blur-on-reach-max-length
    mandatory
    type="initialname"
  />
</template>
