<script setup lang="ts">
import { computed } from 'vue';
import { TooltipSpanProps } from './TooltipSpan.vue.d';

const props = withDefaults(defineProps<TooltipSpanProps>(), {
  fullText: '',
  length: 36,
});

const truncatedText = computed<string>(() => {
  return props.fullText.length > props.length
    ? `${props.fullText.substring(0, props.length)}...`
    : (props.fullText ?? '-');
});
</script>

<template>
  <span v-tooltip.top="fullText.length > length ? fullText : undefined">
    {{ truncatedText }}
  </span>
</template>
