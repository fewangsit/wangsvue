<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue';
import { ButtonProps } from '../button/Button.vue.d';
import { EditorContent, FloatingMenu, useEditor } from '@tiptap/vue-3';
import { MenuItem } from '../menuitem';
import { FormPayload } from '../form/Form.vue.d';
import { EditorProps, EditorEmits } from './Editor.vue.d';

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
import FloatingMenuExt from '@tiptap/extension-floating-menu';
import Menu from 'primevue/menu';
import MenuPreset from 'lib/preset/menu';
import OverlayPanel from 'primevue/overlaypanel';
import InputURL from '../inputurl/InputURL.vue';
import InputText from '../inputtext/InputText.vue';
import Form from '../form/Form.vue';
import EditorButton from './EditorButton.vue';
import Dialog from '../dialog/Dialog.vue';
import Icon from '../icon/Icon.vue';

const props = defineProps<EditorProps>();
const emit = defineEmits<EditorEmits>();

const linkFormShown = shallowRef(false);
const headingMenu = ref<Menu>();
const editLinkOverlay = ref<OverlayPanel>();
const root = ref<HTMLDivElement>();
const previewImages = ref<string[]>([]);
const imageDialogUploader = ref<boolean>(false);
const inputURLImage = ref<string>();

const editor = useEditor({
  content: props.textContentInitialValue,
  onUpdate: () => {
    emit('update:modelValue', editor.value.getJSON());
  },
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
          ShowDialog: (): boolean => setImageDialog(),
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
          'Mod-k': (): boolean => openLinkForm(),
        };
      },
    }).configure({
      openOnClick: false,
    }),
    History,

    FloatingMenuExt,
  ],
});

const openLinkForm = (e?: Event): boolean => {
  linkFormShown.value = true;

  const event =
    e ??
    ({
      currentTarget: root.value?.querySelector('.ic-link-m')?.closest('button'),
    } as unknown as Event);

  const { dom } = editor.value?.view ?? {};
  editLinkOverlay.value?.toggle(event, dom);

  return true;
};

const setLinkFunction = ({ formValues }: FormPayload): boolean => {
  if (!editor.value) return false;

  const { setLink, insertContent, focus } = editor.value.commands;
  const { url, text } = formValues as unknown as { url: string; text?: string };
  const { state } = editor.value;

  focus();

  // Apply the link to the selected or inserted text
  setLink({
    href: url,
    target: '_blank',
    rel: 'nofollow',
  });

  // On edit link: Replace Entire Anchor text with the new one
  if (editor.value?.isActive('link')) {
    editor.value
      .chain()
      .focus()
      .command(({ tr, state: currState }) => {
        const { $from, $to } = currState.selection;

        // Find the start and end of the link mark
        const linkMark = state.schema.marks.link;
        let start = $from.start(),
          end = $to.end();

        // Adjust the range to cover the entire link
        state.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
          if (
            node.isText &&
            node.marks.some((mark) => mark.type === linkMark)
          ) {
            start = Math.min(start, pos);
            end = Math.max(end, pos + node.nodeSize);
          }
        });

        // Replace the text within the link without affecting the link itself
        tr.insertText(text || url, start, end);

        return true;
      })
      .run();
  } else if (state.selection.empty) {
    insertContent(text || url);
  }

  editLinkOverlay.value?.hide();
  linkFormShown.value = false;

  return true;
};

const setImageFunction = (imageUrl?: string): void => {
  editor.value.commands.focus();
  if (imageUrl) {
    editor.value.commands.setImage({ src: imageUrl });
    previewImages.value = [...previewImages.value, imageUrl];
  }
  if (inputURLImage.value) {
    editor.value.commands.setImage({ src: inputURLImage.value });
    previewImages.value = [...previewImages.value, inputURLImage.value];
  }

  inputURLImage.value = undefined;
};

const toolbars = computed<(ButtonProps & { active?: boolean })[]>(() => {
  if (!editor.value) return [];

  const {
    toggleBold,
    focus,
    toggleItalic,
    toggleUnderline,
    toggleBulletList,
    toggleCode,
    toggleOrderedList,
    unsetAllMarks,
    clearNodes,
  } = editor.value.commands;

  const isInlineCode = editor.value?.isActive('code');

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
      tooltipText: 'Bold | Ctrl + B',
      active: editor.value?.isActive('bold'),
      disabled: isInlineCode,
      onClick: (): void => {
        focus();
        toggleBold();
      },
    },
    {
      icon: 'italic',
      tooltipText: 'Italic | Ctrl + I',
      active: editor.value?.isActive('italic'),
      disabled: isInlineCode,
      onClick: (): void => {
        focus();
        toggleItalic();
      },
    },
    {
      icon: 'underline',
      class: 'mr-3',
      active: editor.value?.isActive('underline'),
      tooltipText: 'Underline | Ctrl + U',
      disabled: isInlineCode,
      onClick: (): void => {
        focus();
        toggleUnderline();
      },
    },
    {
      icon: 'list-unordered',
      tooltipText: 'Bullet List | Ctrl + 7',
      active: editor.value?.isActive('bullet-list'),
      onClick: (): void => {
        focus();
        toggleBulletList();
      },
    },
    {
      icon: 'list-ordered',
      tooltipText: 'Numbered List | Ctrl + 8',
      active: editor.value?.isActive('ordered-list'),
      class: 'mr-3',
      onClick: (): void => {
        focus();
        toggleOrderedList();
      },
    },
    {
      icon: 'link-m',
      tooltipText: 'Link | Ctrl + K',
      disabled: editor.value?.isActive('link') || linkFormShown.value,
      onClick: openLinkForm,
    },
    {
      icon: 'image-add',
      active: editor.value?.isActive('image'),
      tooltipText: 'Image | Insert',
      onClick: (): boolean => setImageDialog(),
    },
    {
      icon: 'code-line',
      active: editor.value?.isActive('code'),
      tooltipText: 'Inline Code | Ctrl + E',
      onClick: (): void => {
        focus();
        toggleCode();
      },
    },
    {
      icon: 'format-clear',
      tooltipText: 'Clear Formatting Ctrl + \\',
      disabled:
        !editor.value?.isActive('bold') &&
        !editor.value?.isActive('underline') &&
        !editor.value?.isActive('italic') &&
        !editor.value?.isActive('code') &&
        !editor.value?.isActive('heading'),
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

const currentActiveLink = computed(() => {
  return editor.value?.getAttributes('link') as { href: string };
});

/**
 * Get the current active Link Node anchor text for Link form Text Input initial value
 */
const getInitialAnchorText = (): string | undefined => {
  const { href } = currentActiveLink.value;
  const anchor = editor.value?.view.dom.querySelector(`[href="${href}"]`);

  return (
    getSelectedText() ||
    (anchor && anchor?.textContent !== href
      ? anchor.textContent || undefined
      : undefined)
  );
};

const openLinkInNewTab = (): void => {
  window.open(currentActiveLink.value?.href, '_blank');
};

const copyLink = (): void => {
  window.navigator.clipboard.writeText(currentActiveLink.value?.href);
};

const unsetLinkFunction = (): void => {
  if (editor.value) {
    const { unsetLink, focus } = editor.value?.commands ?? {};

    focus();
    unsetLink();
  }
};

const getSelectedText = (): string | undefined => {
  if (editor.value) {
    const { state } = editor.value;
    const { from, to } = state.selection;

    // Get the selected text between the 'from' and 'to' positions
    const selectedText = state?.doc.textBetween(from, to, ' ');
    return selectedText;
  }
};

const setImageDialog = (): boolean => {
  imageDialogUploader.value = true;
  return false;
};

const setPreviewImages = (data: {
  target: {
    files: File[];
  };
}): void => {
  emit('postImageLocal', {
    image: data.target.files[0],
    setImageCb: setImageFunction,
  });
};
</script>

<template>
  <div
    ref="root"
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
      <EditorButton
        v-bind="tool"
        :key="tool.icon"
        v-for="tool of toolbars"
        :class="[{ '!bg-primary-50': tool.active }]"
      />
    </div>

    <EditorContent
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

    <OverlayPanel
      ref="editLinkOverlay"
      :pt="{
        content: {
          class: '',
        },
      }"
      @hide="linkFormShown = false"
      append-to="self"
      class="w-[342px] bg-white p-4"
    >
      <Form @submit="setLinkFunction" class="!gap-0" hide-stay-checkbox>
        <template #fields>
          <InputURL
            v-focus
            :validator-message="{ empty: 'Masukan tautan yang valid' }"
            :value="currentActiveLink?.href"
            field-name="url"
            label="Tempel Tautan"
            mandatory
            placeholder="Tempel tautan baru"
            use-validator
          />
          <InputText
            :value="getInitialAnchorText()"
            field-name="text"
            label="Teks Tampilan"
            placeholder="Teks untuk ditampilkan"
            use-validator
          />

          <Button
            :label="editor?.isActive('link') ? 'Simpan' : 'Tambahkan'"
            class="w-max ml-auto"
            severity="secondary"
            type="submit"
          />
        </template>
      </Form>
    </OverlayPanel>

    <FloatingMenu
      v-if="editor && !linkFormShown"
      :editor="editor"
      :should-show="() => !!editor?.isActive('link')"
      :tippy-options="{ placement: 'bottom', zIndex: 9 }"
      class="-mt-1.5 shadow-panel"
      plugin-key="editLinkToolbar"
    >
      <div
        :class="[
          'flex gap-2 bg-white border-[0.5px] px-2 py-1 rounded-sm',

          `[&_.separator::after]:content-['|']`,
          `[&_.separator::after]:text-xl`,
          `[&_.separator::after]:font-thin`,
          `[&_.separator]:h-6`,
        ]"
      >
        <EditorButton
          @click="openLinkForm"
          class="!w-max"
          label="Edit Tautan"
          severity="secondary"
          text
        />
        <span class="separator" />
        <EditorButton
          @click="openLinkInNewTab"
          icon="external-link"
          severity="secondary"
          text
          tooltip-text="Buka di tab baru"
        />
        <span class="separator" />
        <EditorButton
          @click="unsetLinkFunction"
          icon="link-unlink-m"
          severity="secondary"
          text
          tooltip-text="Lepas tautan"
        />
        <span class="separator" />
        <EditorButton
          @click="copyLink"
          icon="file-copy"
          severity="secondary"
          text
          tooltip-text="Salin tautan"
        />
      </div>
    </FloatingMenu>

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

    <Dialog
      v-model:visible="imageDialogUploader"
      class="w-[400px]"
      header="Pilih Gambar"
    >
      <template #default>
        <div class="flex flex-col gap-4">
          <div class="flex gap-2">
            <InputURL
              v-model:model-value="inputURLImage"
              class="w-[269px]"
              label="URL Gambar"
            />
            <div class="flex items-end">
              <Button
                @click="setImageFunction(null)"
                label="Simpan"
                severity="secondary"
              />
            </div>
          </div>
          <div>
            <p>Baru Saja Ditambahkan</p>
            <div class="flex flex-wrap justify-center gap-2">
              <Img
                :key="index"
                v-for="(previewImage, index) in previewImages"
                :src="previewImage"
                alt="preview"
                class="w-28 h-28 rounded-lg"
              />
              <div class="flex flex-col justify-center w-28 h-28 items-center">
                <Icon
                  class="w-[70px] h-[70px]"
                  icon="upload-2"
                  severity="primary"
                />
                <Button severity="secondary">
                  <template #default>
                    <div class="relative py-[7px] px-3">
                      <p>Cari Gambar</p>
                      <Input
                        @change="setPreviewImages"
                        class="opacity-0 absolute top-0 bottom-0 left-0 right-0"
                        type="file"
                      />
                    </div>
                  </template>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>
