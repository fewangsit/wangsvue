<script setup lang="ts">
import DocTitle from '../DocTitle.vue';
import Card from '../../../library/components/card/Card.vue';
import PDFViewer from 'lib/components/pdfviewer/PDFViewer.vue';
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="PDF Viewer" />
    </template>

    <template #content>
      <PDFViewer />
    </template>
  </Card>
</template>
