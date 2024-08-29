<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import InputText from '../inputtext/InputText.vue';
import { Nullable } from '../ts-helpers';
import type {
  InputInitialNameEmits,
  InputInitialNameProps,
} from './InputInitialName.vue.d';
import { getInititalName } from 'lib/utils';

const props = withDefaults(defineProps<InputInitialNameProps>(), {
  maxLength: 3,
  existingInitialNames: () => [],
});

const emit = defineEmits<InputInitialNameEmits>();

onMounted(() => {
  if (!props.value) convertFullNameToInitial();
});

const model = computed({
  get() {
    return props.modelValue?.slice(0, props.maxLength).toUpperCase();
  },
  set(value: string | undefined) {
    emit('update:modelValue', value?.slice(0, props.maxLength).toUpperCase());
  },
});

const isExist = computed(() => {
  return props.existingInitialNames?.includes(model.value ?? '');
});

const errorMessage = computed(() => {
  if (isExist.value) return 'Inisial nama sudah ada';
  return {
    empty: 'Inisial nama tidak boleh kosong',
  };
});

const convertFullNameToInitial = (): void => {
  model.value =
    getInititalName(
      props.existingInitialNames,
      props.fullName,
      props.maxLength,
    )?.slice(0, props.maxLength) || undefined;
};

watch(
  () => props.fullName,
  () => {
    convertFullNameToInitial();
  },
);

watch(
  () => props.value,
  () => {
    model.value = props.value;
  },
  { once: true },
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
    :max-length="maxLength"
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
