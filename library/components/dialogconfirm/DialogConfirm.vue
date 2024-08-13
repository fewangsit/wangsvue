<script setup lang="ts">
import { computed, ref, withDefaults } from 'vue';
import Dialog from 'primevue/dialog';

import DialogPreset from 'lib/preset/dialog';
import { getNestedProperyValue } from 'lib/utils';
import {
  DialogConfirmEmits,
  DialogConfirmProps,
  DialogConfirmSlots,
} from './DialogConfirm.vue.d';
import Icon from '../icon/Icon.vue';
import Button from '../button/Button.vue';

const props = withDefaults(defineProps<DialogConfirmProps>(), {
  list: undefined,
  listLabel: undefined,
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
  return props.severity === 'danger' ? 'error' : 'checkbox-circle';
});

const closeDialog = (): void => emit('update:visible', false);

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
        'data-section-name': $attrs['data-section-name'] ?? 'root',
        'data-ts-name': $attrs['data-ts-name'] ?? 'dialogconfirm',
      },
      header: {
        'class': [...DialogPreset.header.class],
        'data-section-name': 'dialog-confirm-header',
      },
      content: {
        'class': [
          ...DialogPreset.content({ state: {}, instance: {} }).class,
          '[&_ul]:list-inside [&_ul]:list-disc [&_ul_li]:pl-[6px]',
        ],
        'data-section-name': 'dialog-confirm-content',
      },
      footer: {
        'class': [
          ...DialogPreset.footer.class,
          'flex items-end justify-end gap-1 !mt-0',
        ],
        'data-section-name': 'dialog-confirm-footer',
      },
    }"
    @update:visible="emit('update:visible', !!$event)"
    close-on-escape
    data-section-name="dialog-confirm"
    modal
  >
    <template #header>
      <Icon
        v-if="showIcon"
        :icon="headerIcon"
        :severity="severity"
        aria-label="Header Icon"
        class="text-2xl"
        data-section-name="headericon"
      />
      <h3
        :class="[
          'text-base leading-none font-semibold',
          {
            'text-success-700': severity === 'success',
            'text-danger-700': severity === 'danger',
          },
        ]"
        data-section-name="dialog-confirm-title"
      >
        {{ header }}
      </h3>
    </template>

    <template #default>
      <ul v-if="list" data-section-name="dialog-confirm-list">
        <li :key="index" v-for="(item, index) in list">
          {{
            listLabel && typeof item !== 'string'
              ? getNestedProperyValue(item, listLabel)
              : item
          }}
        </li>
      </ul>

      <slot :items="list" name="body">
        <p data-section-name="confirm-message">{{ message }}</p>
      </slot>
    </template>

    <template #footer>
      <slot name="footer">
        <Button
          :label="props.actionable ? 'Batal' : 'Tutup'"
          @click="closeDialog"
          data-section-name="cancel-button"
          severity="secondary"
          text
        />

        <Button
          v-if="actionable"
          v-focus
          :label="confirmLabel"
          :severity="severity"
          @click="confirm"
          data-section-name="confirm-button"
        />
      </slot>
    </template>
  </Dialog>
</template>
