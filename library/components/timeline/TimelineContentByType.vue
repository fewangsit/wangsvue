<script setup lang="ts">
import {
  AttachmentFile,
  AttachmentLink,
  DetailJSONContent,
  DetailText,
  LinkTaskIframeEmbed,
  LinkTaskURL,
} from './Timeline.vue.d';
import Editor from '../editor/Editor.vue';
import Image from '../image/Image.vue';
import pdf from 'lib/assets/icons/pdf.svg';
import csv from 'lib/assets/icons/csv.svg';
import doc from 'lib/assets/icons/doc.svg';
import xls from 'lib/assets/icons/xls.svg';
import data from 'lib/assets/icons/data.svg';
import Icon from '../icon/Icon.vue';

defineProps<{
  detail:
    | AttachmentFile
    | LinkTaskIframeEmbed
    | LinkTaskURL
    | AttachmentLink
    | DetailText
    | DetailJSONContent;
}>();

const getFileIcon = (type: string): string | undefined => {
  return {
    pdf,
    csv,
    doc,
    xls,
    data,
  }[type];
};

const getAttchmentFileName = (detail: AttachmentFile): string | undefined => {
  return detail.filePath?.slice((detail.filePath?.lastIndexOf('/') ?? 0) + 1);
};
</script>
<template>
  <p v-if="detail.type === 'text'">
    {{ detail.value }}
  </p>

  <Editor
    v-else-if="detail.type === 'json'"
    :model-value="detail.value"
    editor-state="readonly"
  />

  <span v-else-if="detail.type === 'taskUrl'" class="grid">
    <a
      :class="['w-full truncate hover:underline text-[#0000EE]']"
      :href="detail.url"
      style="scrollbar-width: none"
      target="_blank"
      title="Buka Link di Tab Baru"
    >
      {{ detail.url }}
    </a>
  </span>

  <template v-else-if="detail.type == 'embed'">
    <div class="w-full overflow-auto" style="scrollbar-width: none">
      <pre class="w-max">{{ detail?.code }}</pre>
    </div>
  </template>

  <div v-else class="grid grid-cols-[max-content,1fr] gap-2 items-center">
    <Image
      v-if="detail.type === 'image'"
      :src="detail.filePath"
      class="!w-6 !h-6 shrink-0"
    />

    <Icon
      v-else-if="detail.type === 'link'"
      class="shrink-0 w-6 h-6"
      icon="link"
    />

    <img
      v-else-if="['pdf', 'csv', 'doc', 'xls', 'data'].includes(detail.type)"
      :alt="detail.type"
      :src="getFileIcon(detail.type)"
      class="shrink-0 w-6 h-6"
    />

    <a
      v-if="detail.type === 'link'"
      :class="['w-full truncate hover:underline']"
      :href="detail.url"
      style="scrollbar-width: none"
      target="_blank"
      title="Buka Link di Tab Baru"
    >
      {{ detail.url }}
    </a>

    <template v-else-if="detail.type !== 'video'">
      {{ getAttchmentFileName(detail) }}
    </template>
  </div>
</template>
