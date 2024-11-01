<script setup lang="ts">
import { computed, inject, watch } from 'vue';

import ChangelogPage from '../changelogpage/ChangelogPage.vue';
import Dialog from '../dialog/Dialog.vue';
import Icon from '../icon/Icon.vue';

import eventBus from 'lib/event-bus';
import { ChangelogEmits, ChangelogProps } from './Changelog.vue.d';

const { buttonFocusClass } = inject<Record<string, any>>('preset', {}).button;
const Preset = inject<Record<string, any>>('preset', {}).changelog;

const props = withDefaults(defineProps<ChangelogProps>(), {
  useButton: true,
});

defineEmits<ChangelogEmits>();

const visible = defineModel<boolean>('visible', {
  required: false,
  default: false,
});

const tableName = computed(() => {
  return (
    props.tableName ??
    `changelog-${props.object?.toLowerCase().split(' ').join('-')}`
  );
});

const changelogColumnHeader = computed<string>(() => {
  const splittedObj = props.object?.split('>');

  if (splittedObj.length > 1) {
    return splittedObj[splittedObj.length - 1]?.trim();
  }

  switch (props.object) {
    case 'Akun Member':
      return 'Email';
    case 'Process':
      return 'Template Process';
    case 'groupMember':
      return 'Grup Member';
    default:
      return props.object;
  }
});

const header = computed<string>(() => {
  if (props.header) return props.header;
  return 'Changelog: ' + changelogColumnHeader.value;
});

/**
 * Need to reset the state to make sure every dialog open, the fetch result is correct.
 */
const resetState = (): void => {
  eventBus.emit('show-filter', { tableName: tableName.value, show: false });
};

watch(visible, (newValue) => {
  if (newValue) resetState();
});
</script>

<template>
  <button
    v-if="props.useButton"
    @click="visible = true"
    v-bind="Preset?.button(buttonFocusClass)"
    type="button"
  >
    <Icon
      v-bind="Preset?.icon"
      :icon="visible ? 'file-history-fill' : 'file-history'"
      info="Changelog"
      severity="secondary"
      tooltip-pos="bottom"
    />
  </button>
  <Dialog
    v-bind="Preset?.dialog"
    v-model:visible="visible"
    :base-z-index="3000"
    :header="header"
    @hide="$emit('hide')"
    modal
  >
    <ChangelogPage v-if="visible" v-bind="$props" :is-dialog="visible" />
  </Dialog>
</template>
