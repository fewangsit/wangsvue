import { VueRenderer } from '@tiptap/vue-3';
import tippy from 'tippy.js';
import MentionList from './MentionList.vue';

const suggestion = (): any => {
  return {
    render: (): any => {
      let component: any;
      let popup: any;

      return {
        onStart(props: any): void {
          component = new VueRenderer(MentionList, {
            props: {
              items: props.items,
              command: props.command,
            },
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          });
        },

        onUpdate(props: any): void {
          component.updateProps(props);
          if (!props.clientRect) {
            return;
          }

          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props: any): boolean {
          if (props.event.key === 'Escape') {
            popup[0].hide();
            return true;
          }
          return component.ref.onKeyDown(props.event);
        },

        onExit(): void {
          popup[0].destroy();
          component.destroy();
        },
      };
    },
  };
};

export default suggestion;
