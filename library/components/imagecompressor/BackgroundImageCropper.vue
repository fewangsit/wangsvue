<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import { ref, shallowRef } from 'vue';
import { TransformableImage } from 'vue-advanced-cropper';

const props = defineProps<{
  touchMove?: unknown;
  mouseMove?: unknown;
  touchResize?: unknown;
  wheelResize?: unknown;
}>();

defineEmits<{
  move: [e: any];
  resize: [e: any];
}>();

const notificationVisible = shallowRef<boolean>(false);
const notificationType = ref();

const eventsFilter = (nativeEvent: any, transforming: any): unknown => {
  if (nativeEvent.type === 'touchstart' || nativeEvent.type === 'touchmove') {
    if (nativeEvent.touches.length === 1 && !transforming) {
      notificationVisible.value = true;
      notificationType.value = 'touch';
      hideNotifications();
      return false;
    }
    notificationVisible.value = false;
  } else if (nativeEvent.type === 'wheel') {
    if (!transforming && !nativeEvent.ctrlKey) {
      notificationVisible.value = true;
      notificationType.value = 'wheel';
      hideNotifications();
      return false;
    }
    notificationVisible.value = false;
  }
  nativeEvent.preventDefault();
  nativeEvent.stopPropagation();
};

const hideNotifications = (): void => {
  setTimeout(() => {
    notificationVisible.value = false;
  }, 1000);
};
</script>

<template>
  <TransformableImage
    :events-filter="eventsFilter"
    :mouse-move="props.mouseMove"
    :touch-move="props.touchMove"
    :touch-resize="props.touchResize"
    :wheel-resize="props.wheelResize"
    @move="$emit('move', $event)"
    @resize="$emit('resize', $event)"
  >
    <slot />
    <div
      :class="{ 'cropper-event-notification--visible': notificationVisible }"
      class="cropper-event-notification"
    >
      {{
        notificationType === 'wheel'
          ? 'Gunakan Ctrl + Scroll untuk perbesar atau perkecil gambar'
          : 'Gunakan dua jari untuk untuk perbesar atau perkecil gambar'
      }}
    </div>
  </TransformableImage>
</template>

<style scoped>
.cropper-event-notification {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 20px;
  transition: opacity 0.5s;
  opacity: 0;
  pointer-events: none;
  padding-left: 50px;
  padding-right: 50px;
}

.cropper-event-notification--visible {
  transition: opacity 0.25s !important;
  pointer-events: all !important;
  opacity: 1 !important;
}
</style>
