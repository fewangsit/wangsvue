<script setup lang="ts">
import PrimeEditor from 'primevue/editor';
import { ref } from 'vue';
const text = ref();
</script>

<template>
  <PrimeEditor :model-value="text" @update:model-value="console.log" />
</template>
