<script setup lang="ts">
import { inject } from 'vue';

const props = defineProps<{
  values: string[];
}>();

const Preset = inject<Record<string, any>>('preset', {}).datatable;
</script>

<template>
  <div v-bind="Preset?.multirowcontainer({ props })">
    <span
      :key="index"
      v-for="(value, index) in values"
      v-bind="
        Preset?.multirow({
          context: {
            firstIndex: index === 0,
          },
        })
      "
    >
      {{ value }}
    </span>
  </div>
</template>
