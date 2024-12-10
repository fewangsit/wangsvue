<script setup lang="ts">
import DataManagerServices from 'lib/services/dataManager.service';
import * as pdfjs from 'pdfjs-dist';
import { onMounted, ref } from 'vue';
import { read, utils } from 'xlsx';
import ExcelViewer from '@zeelyn/excel-preview-vue3';

/*
 * Not used since PDFJS is more complex than using iframe to display pdf viewer
 * pdfjs.GlobalWorkerOptions.workerSrc =
 *   'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.9.124/+esm';
 * console.log(
 *   '🚀 ~ pdfjs.GlobalWorkerOptions.workerSrc:',
 *   pdfjs.GlobalWorkerOptions.workerSrc,
 * );
 */

onMounted(() => {
  getFile();
});

const canvasRef = ref<HTMLDivElement | null>(null);
const fileType = ref<string | null>(null);
const fileContent = ref<string | null>(null);

// BASE URL VITE_APP_SALES_API=https://dev-api-sales.asdf.id
const getFile = async (): Promise<void> => {
  try {
    const { data, headers } = await DataManagerServices.getFile(
      '/elsa/file_1733395763186.pdf',
    );

    fileType.value = headers['content-type'];

    // Convert the response to a Blob URL
    const blob = new Blob([data], { type: fileType.value });

    fileContent.value = URL.createObjectURL(blob);
  } catch (error) {
    console.error(error);
  }
};

// Not used since PDFJS is more complex than using iframe to display pdf viewer
const renderPDF = async (url: string): Promise<void> => {
  try {
    const pdf = await pdfjs.getDocument(url).promise;

    if (canvasRef.value) {
      // Clear existing canvas elements
      canvasRef.value.innerHTML = '';

      // Loop through all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });

        // Create canvas for each page
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const context = canvas.getContext('2d');
        if (context) {
          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;

          // Append canvas to the container
          canvasRef.value.appendChild(canvas);
        }
      }
    }
  } catch (error) {
    console.error('Error rendering PDF:', error);
  }
};
</script>

<template>
  <h1>PDF Viewer</h1>
  <iframe :src="fileContent" height="1000" title="pdf-viewer" />

  <!-- Not used since PDFJS is more complex than using iframe to display pdf viewer -->
  <!-- <div>
    <h1>PDF JS</h1>
    <div
      ref="canvasRef"
      style="display: flex; flex-direction: column; gap: 16px"
    ></div>
  </div> -->
</template>
