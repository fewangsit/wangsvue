<script lang="ts" setup>
import { buttonFocusClass } from 'lib/preset/button';
import Icon from '../icon/Icon.vue';
import type { ButtonDownloadProps } from './ButtonDownload.vue.d';

const props = withDefaults(defineProps<ButtonDownloadProps>(), {
  tableName: 'datatable',
});

const downloadExcel = (): void => {
  const { fileName, tableName } = props;
  const event = new CustomEvent('downloadExcel', {
    detail: { fileName, tableName },
  });

  window.dispatchEvent(event);
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
