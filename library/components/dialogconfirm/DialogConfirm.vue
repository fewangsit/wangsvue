<script setup lang="ts">
import Dialog from 'primevue/dialog';
import { computed, inject, ref } from 'vue';

import { getNestedProperyValue } from 'lib/utils';
import Button from '../button/Button.vue';
import Icon from '../icon/Icon.vue';
import {
  DialogConfirmEmits,
  DialogConfirmProps,
  DialogConfirmSlots,
} from './DialogConfirm.vue.d';

const DialogPreset = inject<Record<string, any>>('preset', {}).dialog;

const DialogConfirmPreset = inject<Record<string, any>>(
  'preset',
  {},
).dialogconfirm;

const props = withDefaults(defineProps<DialogConfirmProps>(), {
  list: undefined,
  listLabel: undefined,
  closeLabel: undefined,
  message: 'Apa kamu yakin?',
  confirmLabel: 'Yakin',
  closeAfterConfirm: true,
  actionable: true,
  showIcon: true,
  showCloseButton: true,
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
          ...DialogPreset?.root({ state: {} }).class,
          ...DialogConfirmPreset?.root.class,
        ],
        'data-wv-section': DialogConfirmPreset?.root['data-wv-section'](
          $attrs['data-wv-section'],
        ),
        'data-wv-name': DialogConfirmPreset?.root['data-wv-name'](
          $attrs['data-wv-name'],
        ),
      },
      header: {
        ...DialogConfirmPreset?.header,
        class: [...DialogPreset?.header.class],
      },
      content: {
        ...DialogConfirmPreset?.content,
        class: [
          ...DialogPreset?.content({ state: {}, instance: {} }).class,
          DialogConfirmPreset?.content.class,
        ],
      },
      footer: {
        ...DialogConfirmPreset?.footer,
        class: [
          ...DialogPreset?.footer.class,
          DialogConfirmPreset?.footer.class,
        ],
      },
    }"
    :visible="props.visible"
    @hide="emit('hide')"
    @update:visible="emit('update:visible', !!$event)"
    close-on-escape
    modal
  >
    <template #header>
      <Icon
        v-if="showIcon"
        v-bind="DialogConfirmPreset?.headericon"
        :icon="headerIcon"
        :severity="severity"
        aria-label="Header Icon"
      />
      <h3 v-bind="DialogConfirmPreset?.headertitle(severity)">
        {{ header }}
      </h3>
    </template>

    <template #default>
      <ul v-if="list" v-bind="DialogConfirmPreset?.list">
        <li :key="index" v-for="(item, index) in list">
          {{
            listLabel && typeof item !== 'string'
              ? getNestedProperyValue(item, listLabel)
              : item
          }}
        </li>
      </ul>

      <slot :items="list" name="body">
        <p v-bind="DialogConfirmPreset?.bodymessage">{{ message }}</p>
      </slot>
    </template>

    <template #footer>
      <slot name="footer">
        <Button
          v-if="showCloseButton"
          v-bind="DialogConfirmPreset?.cancelbutton"
          :label="closeButtonLabel"
          @click="closeDialog"
          severity="secondary"
          text
        />

        <Button
          v-if="actionable"
          v-focus
          v-bind="DialogConfirmPreset?.confirmbutton"
          :label="confirmLabel"
          :severity="severity"
          @click="confirm"
        />
      </slot>
    </template>
  </Dialog>
</template>
