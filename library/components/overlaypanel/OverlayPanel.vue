<script setup lang="ts">
import OverlayPanel from 'primevue/overlaypanel';
import { ref } from 'vue';
import eventBus from 'lib/event-bus';

const overlayId = +new Date();
const op = ref<OverlayPanel>();

const onHideOverlay = (): void => {
  eventBus.off('overlay:show', hideOverlay);
};

const hideOverlay = (event: { overlayId: number }): void => {
  if (op.value && event.overlayId !== overlayId) op.value.hide();
};

const onShowOverlay = async (): Promise<void> => {
  eventBus.emit('overlay:show', { overlayId });
  eventBus.on('overlay:show', hideOverlay);
};

const toggle = (event: Event): void => {
  op.value.toggle(event);
};

defineExpose({ toggle });
</script>

<template>
  <OverlayPanel
    :id="overlayId"
    ref="op"
    @hide="onHideOverlay"
    @show="onShowOverlay"
  >
    <slot />
  </OverlayPanel>
</template>
