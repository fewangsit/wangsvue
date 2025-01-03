<script setup lang="ts">
import { ref } from 'vue';
import { OverlayPanelProps } from './OverlayPanel.vue.d';
import OverlayPanel from 'primevue/overlaypanel';
import eventBus from 'lib/event-bus';

const overlayId = +new Date();
const op = ref<OverlayPanel>();
const props = withDefaults(defineProps<OverlayPanelProps>(), {
  dismissable: true,
  dismissableOverlay: true,
  showCloseIcon: false,
  baseZIndex: 0,
  autoZIndex: true,
  unstyled: false,
  closeOnEscape: true,
});

const onHideOverlay = (): void => {
  eventBus.off('overlay:show', hideOverlay);
};

const hideOverlay = (event: { overlayId: number }): void => {
  if (op.value && event.overlayId !== overlayId && props.dismissableOverlay)
    op.value.hide();
};

const onShowOverlay = async (): Promise<void> => {
  eventBus.emit('overlay:show', { overlayId });
  eventBus.on('overlay:show', hideOverlay);
};

const toggle = (event: Event): void => {
  op.value.toggle(event);
};

const show = (event: Event): void => {
  op.value.show(event);
};

const hide = (): void => {
  op.value.hide();
};

defineExpose({ toggle, hide, show });
</script>

<template>
  <OverlayPanel
    v-bind="$props"
    :id="overlayId"
    ref="op"
    @hide="onHideOverlay"
    @show="onShowOverlay"
  >
    <slot />
  </OverlayPanel>
</template>
