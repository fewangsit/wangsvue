<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef } from 'vue';
import { ToastProps, ToastEmits } from 'lib/components/toast/Toast.vue.d';
import { ToastParams } from 'lib/utils/toast.util';
import Toast from 'primevue/toast';
import Icon from 'lib/components/icon/Icon.vue';
import eventBus from 'lib/event-bus';

withDefaults(defineProps<ToastProps>(), {
  position: 'bottom-right',
  baseZIndex: 9980,
});

defineEmits<ToastEmits>();

onMounted(() => {
  eventBus.on('toast:add', handleToastAdd);
});

onBeforeUnmount(() => {
  eventBus.off('toast:add', handleToastAdd);
});

const toastParams = shallowRef<ToastParams>();

const handleToastAdd = (params: ToastParams): void => {
  toastParams.value = params;
};
</script>

<template>
  <Toast
    v-bind="$props"
    @close="$emit('close', $event)"
    @life-end="$emit('lifeEnd', $event)"
  >
    <template #icon>
      <Icon
        :id="new Date().getTime()"
        :class="['w-5 h-5', toastParams.iconClass]"
        :icon="
          (() =>
            toastParams.icon ??
            (toastParams.severity === 'success'
              ? 'emotion-happy-fill'
              : 'emotion-unhappy-fill'))()
        "
      />
    </template>
    <template
      #container="{ message, closeCallback }"
      v-if="$slots['container']"
    >
      <slot
        :close-callback="closeCallback"
        :message="message"
        name="container"
      />
    </template>
    <template #message="{ message }" v-if="$slots['message']">
      <slot :message="message" name="message" />
    </template>
  </Toast>
</template>
