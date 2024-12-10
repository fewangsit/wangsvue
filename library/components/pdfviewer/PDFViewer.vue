<script setup lang="ts">
import DataManagerServices from 'lib/services/dataManager.service';
import { onMounted, ref } from 'vue';

onMounted(() => {
  getFile();
});

const fileContent = ref<string | null>(null);

const getFile = async (): Promise<void> => {
  try {
    const { data, headers } = await DataManagerServices.getFile(
      '/elsa/file_1733395763186.pdf',
    );

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
