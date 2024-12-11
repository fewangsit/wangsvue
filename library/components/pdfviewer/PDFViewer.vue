<script setup lang="ts">
import DataManagerServices from 'lib/services/dataManager.service';
import { onMounted, ref } from 'vue';
import { PDFViewerProps } from './PDFViewer.vue.d';

onMounted(() => {
  getFile();
});

const props = defineProps<PDFViewerProps>();

const fileContent = ref<string | null>(null);

const getFile = async (): Promise<void> => {
  try {
    const { data, headers } = await DataManagerServices.getFile(props.fileName);

    // Convert the response to a Blob URL
    const blob = new Blob([data], { type: headers['content-type'] });

    fileContent.value = URL.createObjectURL(blob);
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <h1>Document Viewer</h1>
  <iframe :src="fileContent" height="1000" title="pdf-viewer" />
</template>
