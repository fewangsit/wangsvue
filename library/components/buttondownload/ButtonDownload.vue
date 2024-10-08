<script lang="ts" setup>
import { buttonFocusClass } from 'lib/preset/wangsvue/button';
import type { ButtonDownloadProps } from './ButtonDownload.vue.d';
import eventBus from 'lib/event-bus';
import Icon from '../icon/Icon.vue';

const props = withDefaults(defineProps<ButtonDownloadProps>(), {
  tableName: 'datatable',
});

const downloadExcel = (): void => {
  const { fileName, tableName } = props;
  const event = { fileName, tableName };

  eventBus.emit('data-table:download', event);
};
</script>

<template>
  <button :class="buttonFocusClass" @click="downloadExcel" type="button">
    <Icon
      class="text-2xl"
      icon="download"
      info="Download"
      severity="secondary"
      tooltip-pos="bottom"
    />
  </button>
</template>
