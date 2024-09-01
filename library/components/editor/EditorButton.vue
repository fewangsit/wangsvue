<script setup lang="ts">
import Button from '../button/Button.vue';
</script>

<template>
  <Button
    :class="['!rounded !h-6 !w-6 !p-1']"
    :tooltip="{
      pt: {
        text: {
          style:
            'font-size: 9px !important; padding: 2px 6px; border-radius: 8px',
        },
      },
      value: $attrs['tooltipText'] ?? $attrs['tooltip-text'],
    }"
    icon-class="!w-4 !h-4"
    severity="secondary"
    text
    tooltip-pos="top"
  />
</template>
