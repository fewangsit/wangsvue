<script lang="ts" setup>
import Button from '../button/Button.vue';
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
  <Button
    @click="downloadExcel"
    v-bind="$attrs"
    icon="download"
    severity="secondary"
    text
    tooltip="Download"
    tooltip-pos="bottom"
  />
</template>
