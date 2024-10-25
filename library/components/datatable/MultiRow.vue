<script setup lang="ts">
defineProps<{
  values: string[];
}>();
</script>

<template>
  <div :class="`grid-rows-${values.length}`" class="grid grid-cols-1">
    <span
      :key="index"
      v-for="(value, index) in values"
      :class="{ '!border-t border-primary-100 !border-solid': index !== 0 }"
      class="!h-[35px] flex items-center px-2"
    >
      {{ value }}
    </span>
  </div>
</template>
