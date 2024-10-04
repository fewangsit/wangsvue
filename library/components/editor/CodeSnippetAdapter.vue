<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3';
import CodeSnippet from '../codesnippet/CodeSnippet.vue';
import { ref, watch } from 'vue';

// eslint-disable-next-line vue/define-props-declaration
const props = defineProps(nodeViewProps);
const code = ref(props.node.attrs.code);

watch(code, () => {
  props.updateAttributes({ code: code.value });
});
</script>

<template>
  <NodeViewWrapper>
    <CodeSnippet v-model:code="code" />
  </NodeViewWrapper>
</template>
