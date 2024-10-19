<script setup lang="ts">
import { watch } from 'vue';
import { useForm } from 'lib/build-entry';
import Toast from 'lib/components/toast/Toast.vue';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import FileUpload from 'lib/components/fileupload/FileUpload.vue';

const { values } = useForm();

watch(values, () => {
  // eslint-disable-next-line no-console
  console.log(values);
});
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="File Upload" />
    </template>
    <template #content>
      <span>Will Show Toast Error when file size more than 1MB </span>
      <FileUpload
        :max-file-size="1000000"
        @error="console.log"
        accept=".pdf,.xlsx,.xls.docx"
        file-extensions=".pdf .xls .docx"
        use-error-toast
        use-validator
      />
      <Toast />
      See console to see the values, Form Values {{ values }}
    </template>
  </Card>
</template>
