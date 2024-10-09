<script setup lang="ts">
import { inject } from 'vue';
import Dialog from 'primevue/dialog';
import { DialogProps, DialogEmits } from './Dialog.vue.d';

const DialogPreset = inject<Record<string, any>>('preset').dialog;

withDefaults(defineProps<DialogProps>(), {
  header: undefined,
  footer: undefined,
  visible: false,
  modal: true,
  contentStyle: undefined,
  headerClass: undefined,
  contentClass: undefined,
  contentProps: undefined,
  rtl: false,
  closable: true,
  dismissableMask: false,
  closeOnEscape: true,
  showHeader: true,
  blockScroll: false,
  baseZIndex: 0,
  autoZIndex: true,
  position: 'center',
  maximizable: false,
  breakpoints: undefined,
  draggable: false,
  keepInViewPort: true,
  minX: 0,
  minY: 0,
  appendTo: 'body',
  style: undefined,
  closeIcon: undefined,
  maximizeIcon: undefined,
  minimizeIcon: undefined,
  pt: undefined,
  ptOptions: undefined,
  unstyled: false,
  class: '',
});

defineEmits<DialogEmits>();
</script>

<template>
  <Dialog
    v-bind="$props"
    :pt="{
      root: {
        class: [
          ...DialogPreset.root({ state: {} }).class,
          ...(Array.isArray($props.class) ? $props.class : [$props.class]),
        ],
      },
      header: {
        'class': [
          ...DialogPreset.header.class,
          ...(Array.isArray($props.headerClass)
            ? $props.headerClass
            : [$props.headerClass]),
        ],
        'data-wv-section': 'dialogheader',
      },
      content: {
        class: [
          ...DialogPreset.content({ state: {}, instance: {} }).class,
          ...(Array.isArray($props.contentClass)
            ? $props.contentClass
            : [$props.contentClass]),
        ],
      },
      footer: {
        class: [
          ...DialogPreset.footer.class,
          ...(Array.isArray($props.footerClass)
            ? $props.footerClass
            : [$props.footerClass]),
        ],
      },
      ...$props.pt,
    }"
    @after-hide="$emit('afterHide')"
    @dragend="$emit('dragend', $event)"
    @hide="$emit('hide')"
    @maximize="$emit('maximize', $event)"
    @show="$emit('show')"
    @unmaximize="$emit('unmaximize', $event)"
    @update:visible="$emit('update:visible', $event)"
  >
    <template #closeicon v-if="$slots.closeicon">
      <slot name="closeicon" />
    </template>

    <template #maximizeicon v-if="$slots.maximizeicon">
      <slot name="maximizeicon" />
    </template>

    <template #header v-if="$slots.header">
      <slot name="header" />
    </template>

    <template #default>
      <slot />
    </template>

    <template #footer v-if="$slots.footer">
      <slot name="footer" />
    </template>
  </Dialog>
</template>
