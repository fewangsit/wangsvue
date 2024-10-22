<script lang="ts" setup>
import { inject } from 'vue';
import type { ButtonDownloadProps } from './ButtonDownload.vue.d';
import eventBus from 'lib/event-bus';
import Icon from '../icon/Icon.vue';

const props = withDefaults(defineProps<ButtonDownloadProps>(), {
  tableName: 'datatable',
});

const Preset = inject<Record<string, any>>('preset', {}).buttondownload;

const downloadExcel = (): void => {
  const { fileName, tableName } = props;
  const event = { fileName, tableName };

  eventBus.emit('data-table:download', event);
};
</script>

<template>
  <button :class="Preset.root" @click="downloadExcel" type="button">
    <Icon
      v-bind="Preset.icon"
      icon="download"
      info="Download"
      severity="secondary"
      tooltip-pos="bottom"
    />
  </button>
</template>
