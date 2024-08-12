<script setup lang="ts">
import OverlayPanel from 'primevue/overlaypanel';
import { ref } from 'vue';

const op = ref();

const toggle = (event: Event): void => {
  op.value.toggle(event);
};

defineExpose({ toggle });
</script>

<template>
  <OverlayPanel ref="op">
    <slot />
  </OverlayPanel>
</template>
