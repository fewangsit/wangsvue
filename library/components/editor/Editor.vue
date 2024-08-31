<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue';
import { ButtonProps } from '../button/Button.vue.d';
import { EditorContent, useEditor } from '@tiptap/vue-3';
import { MenuItem } from '../menuitem';
import Button from '../button/Button.vue';
import Heading from '@tiptap/extension-heading';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import Placeholder from '@tiptap/extension-placeholder';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import OrderedList from '@tiptap/extension-ordered-list';
import BulletList from '@tiptap/extension-bullet-list';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import ListItem from '@tiptap/extension-list-item';
import Paragraph from '@tiptap/extension-paragraph';
import History from '@tiptap/extension-history';
import Menu from 'primevue/menu';
import MenuPreset from 'lib/preset/menu';

const textContent = shallowRef<string>();
const headingMenu = ref<Menu>();

const editor = useEditor({
  content: null,
  extensions: [
    Placeholder.configure({
      placeholder: 'Tulis komentar',
      includeChildren: false,
    }),

    Document.extend({
      addKeyboardShortcuts() {
        return {
          'Mod-\\': (): boolean => {
            this.editor.commands.clearNodes();
            return this.editor.commands.unsetAllMarks();
          },
        };
      },
    }),

    // Blocks
    Heading,
    Paragraph,
    Text,
    Image.extend({
      addKeyboardShortcuts() {
        return {
          Insert: (): boolean =>
            setImageFunction(
              this.editor.commands.setImage,
              this.editor.commands.focus,
            ),
        };
      },
    }),
    CodeBlock,
    OrderedList,
    BulletList,
    ListItem,

    // Marks
    Bold,
    Italic,
    Underline,
    Code,
    Link.extend({
      addKeyboardShortcuts() {
        return {
          'Mod-k': (): boolean => setLinkFunction(),
        };
      },
    }).configure({
      openOnClick: false,
    }),
    History,
  ],
});

const setLinkFunction = (): boolean => {
  const { setLink, unsetLink, insertContent, focus } =
    editor.value?.commands ?? {};
  const isLink = editor.value?.isActive('link');

  if (isLink) unsetLink();
  else {
    const href = window.prompt('Masukan link:');

    if (href) {
      const { state } = editor.value; // Assume editor is available in scope

      focus();

      // Apply the link to the selected or inserted text
      setLink({
        href,
        target: '_blank',
        rel: 'nofollow',
      });

      if (state.selection.empty) {
        insertContent(href);
      }

      return true;
    }
    return false;
  }

  return true;
};

const setImageFunction = (
  setImage: (attr: { src: string; alt?: string; title?: string }) => boolean,
  focus: () => boolean,
): boolean => {
  const url = window.prompt('Masukan URL Gambar:');

  if (url) {
    focus();
    return setImage({ src: url });
  }
};

const toolbars = computed<(ButtonProps & { active?: boolean })[]>(() => {
  const {
    toggleBold,
    focus,
    toggleItalic,
    toggleUnderline,
    toggleBulletList,
    toggleCode,
    toggleOrderedList,
    unsetAllMarks,
    setImage,
    clearNodes,
  } = editor.value?.commands ?? {};

  return [
    {
      label: 'Aa',
      iconPos: 'right',
      icon: 'arrow-down',
      class: '!gap-0 mr-3 !w-max [&_span]:leading-[22px]',
      onClick: headingMenu.value?.toggle,
    },
    {
      icon: 'bold',
      tooltip: 'Bold | Ctrl + B',
      active: editor.value?.isActive('bold'),
      onClick: (): void => {
        focus();
        toggleBold();
      },
    },
    {
      icon: 'italic',
      tooltip: 'Italic | Ctrl + I',
      active: editor.value?.isActive('italic'),
      onClick: (): void => {
        focus();
        toggleItalic();
      },
    },
    {
      icon: 'underline',
      class: 'mr-3',
      active: editor.value?.isActive('underline'),
      tooltip: 'Underline | Ctrl + U',
      onClick: (): void => {
        focus();
        toggleUnderline();
      },
    },
    {
      icon: 'list-unordered',
      tooltip: 'Bullet List | Ctrl + 7',
      active: editor.value?.isActive('bullet-list'),
      onClick: (): void => {
        focus();
        toggleBulletList();
      },
    },
    {
      icon: 'list-ordered',
      tooltip: 'Numbered List | Ctrl + 8',
      active: editor.value?.isActive('ordered-list'),
      class: 'mr-3',
      onClick: (): void => {
        focus();
        toggleOrderedList();
      },
    },
    {
      icon: 'link-m',
      tooltip: 'Link | Ctrl + K',
      active: editor.value?.isActive('link'),
      onClick: (): boolean => setLinkFunction(),
    },
    {
      icon: 'image-add',
      active: editor.value?.isActive('image'),
      tooltip: 'Image | Insert',
      onClick: (): boolean => setImageFunction(setImage, focus),
    },
    {
      icon: 'code-line',
      active: editor.value?.isActive('code'),
      tooltip: 'Inline Code | Ctrl + E',
      onClick: (): void => {
        focus();
        toggleCode();
      },
    },
    {
      icon: 'format-clear',
      tooltip: 'Clear Formatting Ctrl + \\',
      onClick: (): void => {
        focus();
        clearNodes();
        unsetAllMarks();
      },
    },
  ];
});

const headings = shallowRef<MenuItem[]>([
  {
    label: 'Paragraf',
    class: 'p',
    shortCut: 'Ctrl+Alt+P',
    command: (): void => {
      editor.value?.commands.focus();
      editor.value?.commands.setParagraph();
    },
  },
  {
    label: 'Heading 1',
    class: 'heading-1',
    shortCut: 'Ctrl+Alt+1',
    command: (): void => {
      editor.value?.commands.focus();
      editor.value?.commands.setHeading({ level: 1 });
    },
  },
  {
    label: 'Heading 2',
    class: 'heading-2',
    shortCut: 'Ctrl+Alt+2',
    command: (): void => {
      editor.value?.commands.focus();
      editor.value?.commands.setHeading({ level: 2 });
    },
  },
  {
    class: 'heading-3',
    label: 'Heading 3',
    shortCut: 'Ctrl+Alt+3',
    command: (): void => {
      editor.value?.commands.focus();
      editor.value?.commands.setHeading({ level: 3 });
    },
  },
  {
    label: 'Heading 4',
    class: 'heading-4',
    shortCut: 'Ctrl+Alt+4',
    command: (): void => {
      editor.value?.commands.focus();
      editor.value?.commands.setHeading({ level: 4 });
    },
  },
  {
    label: 'Heading 5',
    class: 'heading-5',
    shortCut: 'Ctrl+Alt+5',
    command: (): void => {
      editor.value?.commands.focus();
      editor.value?.commands.setHeading({ level: 5 });
    },
  },
  {
    label: 'Heading 6',
    class: 'heading-6',
    shortCut: 'Ctrl+Alt+6',
    command: (): void => {
      editor.value?.commands.focus();
      editor.value?.commands.setHeading({ level: 6 });
    },
  },
]);
</script>

<template>
  <div
    :class="[
      'rounded-b text-grayscale-900 border-[0.5px]',
      '[&:has(:focus)]:border-general-200 border-general-100',

      // Inline Code
      '[&_code]:bg-primary-100',
      '[&_code]:rounded-md',
      '[&_code]:p-[0.25em_0.3em]',
      '[&_code]:text-[0.85rem]',
      '[&_code]:!font-source-code-pro',
    ]"
    data-wv-name="editor"
  >
    <div
      class="border-b-[0.5px] border-inherit px-3 py-1 flex gap-1"
      data-wv-section="toolbar"
    >
      <Button
        v-bind="tool"
        :key="tool.icon"
        v-for="tool of toolbars"
        :class="['!rounded !h-6 !w-6 !p-1', { '!bg-primary-50': tool.active }]"
        :tooltip="{
          pt: {
            text: {
              style:
                'font-size: 9px !important; padding: 2px 6px; border-radius: 8px',
            },
          },
          value: tool.tooltip,
        }"
        icon-class="!w-4 !h-4"
        severity="secondary"
        text
        tooltip-pos="top"
      />
    </div>

    <EditorContent
      v-model="textContent"
      :class="[
        'px-3 py-2 [&_*]:outline-none',
        '[&_.is-editor-empty:first-child::before]:text-general-200',
        '[&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
        '[&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
        '[&_.is-editor-empty:first-child::before]:font-normal',
        '[&_.is-editor-empty:first-child::before]:pointer-events-none',
        '[&_.is-editor-empty:first-child::before]:float-left',
        '[&_.is-editor-empty:first-child::before]:h-0',

        // Anchor
        '[&_a]:hover:underline transition-transform duration-75',
        '[&_a]:text-link',
        '[&_a]:cursor-pointer',

        // Bold
        '[&_b]:font-bold',
        '[&_strong]:font-bold',

        // Image
        '[&_img.ProseMirror-selectednode]:!outline-[0.5px]',
        '[&_img.ProseMirror-selectednode]:!outline-link',
        '[&_img.ProseMirror-selectednode]:!outline-offset-1',
        '[&_img.ProseMirror-selectednode]:!rounded-sm',
        '[&_img]:my-2',

        // Inline Code
        '[&_*:has(code)]:my-[0.25rem]',
      ]"
      :editor="editor"
      spellcheck="false"
    />

    <Menu ref="headingMenu" :model="headings" popup>
      <template #item="{ item }">
        <a
          :alt="item.label"
          :class="[
            ...MenuPreset.action.class,
            item.class,
            'flex items-center !justify-between h-[30px]',
            {
              'bg-primary-50':
                (editor?.isActive('heading', { level: 1 }) &&
                  item.label === 'Heading 1') ||
                (editor?.isActive('heading', { level: 2 }) &&
                  item.label === 'Heading 2') ||
                (editor?.isActive('heading', { level: 3 }) &&
                  item.label === 'Heading 3') ||
                (editor?.isActive('heading', { level: 4 }) &&
                  item.label === 'Heading 4') ||
                (editor?.isActive('heading', { level: 5 }) &&
                  item.label === 'Heading 5') ||
                (editor?.isActive('heading', { level: 6 }) &&
                  item.label === 'Heading 6') ||
                (editor?.isActive('paragraph') && item.label === 'Paragraf'),
            },
          ]"
          @click="item.command?.({ item, originalEvent: $event })"
        >
          {{ item.label }}
          <code class="!text-[9px] !leading-3 !h-max !font-normal">
            {{ item.shortCut }}
          </code>
        </a>
      </template>
    </Menu>
  </div>
</template>
