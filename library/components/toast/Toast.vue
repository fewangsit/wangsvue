<script setup lang="ts">
import Toast from 'primevue/toast';
import { ToastProps, ToastEmits } from 'lib/components/toast/Toast.vue.d';
import Icon from 'lib/components/icon/Icon.vue';
import { onMounted, ref } from 'vue';

withDefaults(defineProps<ToastProps>(), {
  position: 'bottom-right',
  baseZIndex: 9980,
});

defineEmits<ToastEmits>();

onMounted(() => {
  window.addEventListener('showingToast:severity', (event) => {
    severity.value = event.detail;
  });
});

const severity = ref('');
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
        :icon="
          severity === 'success' ? 'emotion-happy-fill' : 'emotion-unhappy-fill'
        "
        class="w-5 h-5"
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
