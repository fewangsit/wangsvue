<script setup lang="ts">
defineProps<{
  isRequired: boolean;
}>();
</script>
<template>
  <p v-if="isRequired" class="text-red-500">required</p>
  <p v-else>-</p>
</template>
