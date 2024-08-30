<script setup lang="ts">
import { ref, shallowRef, computed, onMounted } from 'vue';
import { CodeSnippetProps } from './CodeSnippet.vue.d';
import hljs from 'highlight.js';
import Button from '../button/Button.vue';

const props = withDefaults(defineProps<CodeSnippetProps>(), {
  lang: 'javascript',
});

const codeSnippet = defineModel<string>('code', { default: '' });

const textarea = ref<HTMLTextAreaElement>();
const codesnippet = ref<HTMLTableElement>();
const lineNumberWidth = shallowRef(0);
const copied = shallowRef(false);

// Format the code into lines and highlight each line
const formattedLines = computed<{ line?: number; code?: string }[]>(() => {
  const lines = codeSnippet.value.split('\n');
  return lines.map((line, index) => {
    const highlightedLine = hljs.highlight(line, {
      language: props.lang,
    }).value;

    return {
      line: index + 1,
      code: highlightedLine,
    };
  });
});

const copyCode = (): void => {
  navigator.clipboard?.writeText(codeSnippet.value);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 1500);
};

onMounted(() => {
  if (codesnippet.value) {
    const linenumber = codesnippet.value.querySelector(
      '[data-wv-section=linenumber]',
    ) as HTMLElement;

    lineNumberWidth.value = linenumber.offsetWidth;
  }
});
</script>

<template>
  <div class="relative w-full overflow-hidden">
    <Button
      v-if="codeSnippet.length && readonly"
      :icon="copied ? 'check' : 'file-copy'"
      @click="copyCode"
      class="peer-hover:visible scale-125 !absolute top-2 right-2 z-50"
      size="small"
      text
    />
    <div
      class="relative rounded text-xs font-normal peer text-grayscale-900 bg-primary-50 overflow-x-auto overflow-y-hidden tracking-normal"
      style="scrollbar-width: none"
    >
      <textarea
        ref="textarea"
        v-if="!readonly"
        v-model="codeSnippet"
        :class="[
          'whitespace-nowrap overflow-x-auto pr-1.5 mt-1',
          'absolute bg-transparent text-transparent z-30 caret-primary-500 leading-5 w-full h-full border-0 outline-none !font-poppins resize-none px-1.5',
        ]"
        :spellcheck="false"
        :style="`left: ${lineNumberWidth}px; width: calc(100% - ${lineNumberWidth + 6}px); scrollbar-width: none;`"
      />
      <table ref="codesnippet" class="relative">
        <tbody class="relative">
          <tr :key="line" v-for="{ line, code } in formattedLines" class="h-5">
            <td
              :class="[
                'font-poppins tracking-0.5px]',
                'px-2 bg-primary-100 sticky left-0 text-right select-none',
                {
                  'pt-1.5': line === 1,
                  'pb-1.5': line === formattedLines.length,
                },
              ]"
              data-wv-section="linenumber"
            >
              {{ line }}
            </td>
            <td
              :class="[
                'px-1.5',
                {
                  'pt-1.5': line == 1,
                  'pb-1.5': line === formattedLines.length,
                },
              ]"
            >
              <pre v-html="code" class="font-poppins" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
