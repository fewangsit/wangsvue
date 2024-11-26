<script setup lang="ts">
import { watch, ref } from 'vue';
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3';

// eslint-disable-next-line vue/define-props-declaration
const props = defineProps(nodeViewProps);

const title = ref(props.node.attrs.title);
const bodyText = ref(props.node.attrs.bodyText);
const bodyEditable = ref(props.node.attrs.bodyEditable);

watch(title, () => {
  props.updateAttributes({ title: title.value });
});

watch(bodyText, () => {
  props.updateAttributes({ bodyText: bodyText.value });
});
</script>
<template>
  <NodeViewWrapper>
    <div
      class="flex flex-col gap-1 border-primary-400 border-[2px] rounded-md relative my-4"
    >
      <p
        class="!font-semibold !text-sm absolute -top-[10px] ml-2 bg-white border-primary-400 border-[2px] px-4 rounded-md"
      >
        <span class="text-xs">#</span>{{ title }}
      </p>
      <span
        :contenteditable="bodyEditable"
        @blur="
          (e: Event) => {
            bodyText = (e.target as HTMLElement).innerText;
          }
        "
        class="p-4 pt-6"
      >
        {{ bodyText }}
      </span>
    </div>
  </NodeViewWrapper>
</template>
