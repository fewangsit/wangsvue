import { Node } from '@tiptap/core';
import { mergeAttributes, VueNodeViewRenderer } from '@tiptap/vue-3';
import CodeSnippetAdapter from './CodeSnippetAdapter.vue';

export default Node.create({
  name: 'codeSnippet',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      code: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'codeSnippet',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['codeSnippet', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return VueNodeViewRenderer(CodeSnippetAdapter);
  },
});
