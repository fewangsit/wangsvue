<script lang="ts" setup>
import { computed } from 'vue';
import RadioButton from 'primevue/radiobutton';

const props = defineProps<{ label?: string; labelId?: string }>();

const labelId = computed(
  () => props.labelId ?? props.label?.split(' ')?.join('-') ?? undefined,
);
</script>

<template>
  <div class="flex items-center gap-1">
    <RadioButton v-bind="$attrs" :input-id="labelId" />
    <label v-if="label" :for="labelId" class="text-xs">{{ label }}</label>
  </div>
</template>
