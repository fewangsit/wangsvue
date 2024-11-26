<script setup lang="ts">
import { useForm } from 'lib/build-entry';
import Card from 'lib/components/card/Card.vue';
import FileUpload from 'lib/components/fileupload/FileUpload.vue';
import Toast from 'lib/components/toast/Toast.vue';
import { watch } from 'vue';
import DocTitle from '../DocTitle.vue';

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
      <span>Single with upload</span>
      <FileUpload
        :max-file-size="1000000"
        @error="console.log"
        @upload="console.log"
        accept=".pdf,.xlsx,.xls.docx"
        file-extensions=".pdf .xls .docx"
        use-error-toast
        use-validator
      />
      <span>Single without upload</span>
      <FileUpload
        :max-file-size="1000000"
        :with-upload="false"
        @error="console.log"
        @upload="console.log"
        accept=".pdf,.xlsx,.xls.docx"
        file-extensions=".pdf .xls .docx"
        use-error-toast
        use-validator
      />
      <span>Multiple with upload</span>
      <FileUpload
        :max-file-size="1000000"
        @error="console.log"
        @upload="console.log"
        accept=".pdf,.xlsx,.xls.docx"
        file-extensions=".pdf .xls .docx"
        multiple
        use-error-toast
        use-validator
      />
      <span>Multiple without upload</span>
      <FileUpload
        :max-file-size="1000000"
        :with-upload="false"
        @error="console.log"
        @upload="console.log"
        accept=".pdf,.xlsx,.xls.docx"
        file-extensions=".pdf .xls .docx"
        multiple
        use-error-toast
        use-validator
      />
      <Toast />
      See console to see the values, Form Values {{ values }}
    </template>
  </Card>
</template>
