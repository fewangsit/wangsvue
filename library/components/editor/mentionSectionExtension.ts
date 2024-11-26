import { Command, Node, RawCommands } from '@tiptap/core';
import { mergeAttributes, VueNodeViewRenderer } from '@tiptap/vue-3';
import MentionSection from './MentionSection.vue';

export default Node.create({
  name: 'mentionSection',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      title: {
        default: '',
      },
      bodyText: {
        default: '',
      },
      bodyEditable: {
        default: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'mentionSection',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['mentionSection', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return VueNodeViewRenderer(MentionSection);
  },

  addCommands(): Partial<
    RawCommands & {
      insertMentionSection: (title: string, bodyEditable: boolean) => Command;
      deleteMentionSection: () => Command;
    }
  > {
    return {
      insertMentionSection:
        (title: string, bodyEditable: boolean): Command =>
        ({ commands }) => {
          return commands.insertContent({
            type: 'mentionSection',
            attrs: {
              title,
              bodyText: 'Tuliskan Sebuah Pesan',
              bodyEditable,
            },
          });
        },
      deleteMentionSection:
        (): Command =>
        ({ commands }) => {
          return commands.deleteSelection();
        },
    };
  },
});
