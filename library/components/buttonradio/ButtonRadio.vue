<script lang="ts" setup>
import RadioButton from 'primevue/radiobutton';
import {
  ButtonRadioEmits,
  ButtonRadioProps,
} from 'lib/components/buttonradio/ButtonRadio.vue.d';

defineProps<ButtonRadioProps>();
defineEmits<ButtonRadioEmits>();
</script>

<template>
  <label class="flex items-center gap-1 cursor-pointer">
    <RadioButton
      v-bind="$props"
      @blur="$emit('blur', $event)"
      @change="$emit('change', $event)"
      @focus="$emit('focus', $event)"
      @update:model-value="$emit('update:model-value', $event)"
    />
    <span v-if="label" class="text-xs">{{ label }}</span>
  </label>
</template>
