<script lang="ts" setup>
import InputSwitch from 'primevue/inputswitch';
import type {
  ButtonToggleProps,
  ButtonToggleEmits,
} from 'lib/components/buttontoggle/ButtonToggle.vue.d';

import InputSwitchPresets from 'lib/preset/inputswitch';

const props = withDefaults(defineProps<ButtonToggleProps>(), {
  triState: false,
});

defineEmits<ButtonToggleEmits>();

const model = defineModel<boolean>({ default: false });
</script>

<template>
  <InputSwitch
    v-if="triState"
    v-model="model"
    :pt="{
      ...InputSwitchPresets,
      slider: ({ props: inputSwitchProps }) => ({
        class: [
          ...InputSwitchPresets.slider({ props: inputSwitchProps }).class,
          {
            'before:!bg-general-100 before:dark:!bg-general-100':
              props.modelValue === undefined,
            'before:!bg-white before:dark:!bg-white':
              props.modelValue === true || props.modelValue === false,
          },
          '!border',
          {
            '!border-general-100': props.modelValue === undefined,
            '!border-transparent':
              props.modelValue === true || props.modelValue === false,
          },
          {
            '!bg-white dark:!bg-white':
              props.modelValue === undefined && !inputSwitchProps.disabled,
            '!bg-danger-500 dark:!bg-danger-500':
              props.modelValue === false && !inputSwitchProps.disabled,
            '!bg-success-500 dark:!bg-success-500':
              props.modelValue === true && !inputSwitchProps.disabled,
            '!bg-general-200 dark:!bg-general-200': inputSwitchProps.disabled,
          },
        ],
      }),
    }"
    @change="$emit('update:modelValue', model)"
  />
  <InputSwitch
    v-else
    v-model="model"
    @change="$emit('update:modelValue', model)"
  />
</template>
