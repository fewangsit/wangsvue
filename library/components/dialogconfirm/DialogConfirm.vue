<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import Dialog from 'primevue/dialog';

import { getNestedProperyValue } from 'lib/utils';
import {
  DialogConfirmEmits,
  DialogConfirmProps,
  DialogConfirmSlots,
} from './DialogConfirm.vue.d';
import Icon from '../icon/Icon.vue';
import Button from '../button/Button.vue';

const DialogPreset = inject('preset')?.dialog;

const props = withDefaults(defineProps<DialogConfirmProps>(), {
  list: undefined,
  listLabel: undefined,
  closeLabel: undefined,
  message: 'Apa kamu yakin?',
  confirmLabel: 'Yakin',
  closeAfterConfirm: true,
  actionable: true,
  showIcon: true,
});

const emit = defineEmits<DialogConfirmEmits>();
defineSlots<DialogConfirmSlots>();

const dialogConfirm = ref<Dialog>();

const headerIcon = computed(() => {
  if (props.headerIcon) return props.headerIcon;
  return props.severity === 'danger' ? 'error-fill' : 'checkbox-circle';
});

const closeButtonLabel = computed<string>(() => {
  if (props.closeLabel) return props.closeLabel;
  return props.actionable ? 'Batal' : 'Tutup';
});

const closeDialog = (): void => {
  emit('update:visible', false);
  emit('close');
};

const confirm = (): void => {
  emit('confirm');
  if (props.closeAfterConfirm) closeDialog();
};
</script>

<template>
  <Dialog
    ref="dialogConfirm"
    :closable="false"
    :draggable="false"
    :header="header"
    :pt="{
      root: {
        'class': [
          ...DialogPreset.root({ state: {} }).class,
          '!w-[clamp(360px,75vw,400px)]',
        ],
        'data-wv-section': $attrs['data-wv-section'] ?? 'root',
        'data-wv-name': $attrs['data-wv-name'] ?? 'dialogconfirm',
      },
      header: {
        'class': [...DialogPreset.header.class],
        'data-wv-section': 'dialog-confirm-header',
      },
      content: {
        'class': [
          ...DialogPreset.content({ state: {}, instance: {} }).class,
          '[&_ul]:list-inside [&_ul]:list-disc [&_ul_li]:pl-[6px]',
        ],
        'data-wv-section': 'dialog-confirm-content',
      },
      footer: {
        'class': [
          ...DialogPreset.footer.class,
          'flex items-end justify-end gap-1 !mt-0',
        ],
        'data-wv-section': 'dialog-confirm-footer',
      },
    }"
    :visible="props.visible"
    @hide="emit('hide')"
    @update:visible="emit('update:visible', !!$event)"
    close-on-escape
    data-wv-section="dialog-confirm"
    modal
  >
    <template #header>
      <Icon
        v-if="showIcon"
        :icon="headerIcon"
        :severity="severity"
        aria-label="Header Icon"
        class="text-2xl"
        data-wv-section="headericon"
      />
      <h3
        :class="[
          'text-base leading-none font-semibold',
          {
            'text-success-700': severity === 'success',
            'text-danger-700': severity === 'danger',
          },
        ]"
        data-wv-section="dialog-confirm-title"
      >
        {{ header }}
      </h3>
    </template>

    <template #default>
      <ul v-if="list" data-wv-section="dialog-confirm-list">
        <li :key="index" v-for="(item, index) in list">
          {{
            listLabel && typeof item !== 'string'
              ? getNestedProperyValue(item, listLabel)
              : item
          }}
        </li>
      </ul>

      <slot :items="list" name="body">
        <p data-wv-section="confirm-message">{{ message }}</p>
      </slot>
    </template>

    <template #footer>
      <slot name="footer">
        <Button
          :label="closeButtonLabel"
          @click="closeDialog"
          data-wv-section="cancel-button"
          severity="secondary"
          text
        />

        <Button
          v-if="actionable"
          v-focus
          :label="confirmLabel"
          :severity="severity"
          @click="confirm"
          data-wv-section="confirm-button"
        />
      </slot>
    </template>
  </Dialog>
</template>
