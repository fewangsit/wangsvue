<script setup lang="ts">
import Image from 'lib/components/image/Image.vue';
import { AttachmentItemData } from './TaskAttachmentItem.vue.d';
import Icon from 'lib/components/icon/Icon.vue';
import { computed } from 'vue';
import { WangsIcons } from 'lib/components/icon/Icon.vue.d';

const props = defineProps<{
  item: Pick<AttachmentItemData, 'type' | 'url'>;
  small?: boolean;
}>();

const imgUrl = computed(() => {
  const baseUrl = 'https://dev-static-assets.wangs.id/img';
  switch (props.item.type) {
    case 'pdf':
      return `${baseUrl}/pdf.svg`;
    case 'xls':
      return `${baseUrl}/xls.svg`;
    case 'csv':
      return `${baseUrl}/csv.svg`;
    case 'doc':
      return `${baseUrl}/doc.svg`;
    case 'txt':
      return `${baseUrl}/txt.svg`;

    default:
      return '';
  }
});

const icon = computed<WangsIcons>(() => {
  switch (props.item.type) {
    case 'link':
      return 'link';
    case 'compressed':
      return 'archive-line';
    default:
      return 'attachment-2';
  }
});

/**
 * Format given url to a file path.
 * Example: https://dev-static-assets.wangs.id/files/attachment/file.txt
 *          will be formatted to /attachment/file.txt
 * @param url The file url to be formatted
 * @returns The formatted file path
 */
const formatFilePath = (url: string): string => {
  return url.includes(import.meta.env.VITE_APP_WANGSIT_FILES_API)
    ? '/' + url.split('/').slice(4).join('/')
    : url;
};
</script>

<template>
  <Image
    v-if="props.item.type === 'image'"
    :class="[
      'object-cover',
      { 'w-[70px]': !props.small, 'h-[70px]': !props.small },
      { 'w-[30px]': props.small, 'h-[30px]': props.small },
    ]"
    :src="formatFilePath(props.item.url)"
  />
  <div
    v-else
    :class="[
      'rounded-lg bg-primary-100 flex justify-center items-center',
      {
        '!w-[70px]': !props.small,
        '!min-w-[70px]': !props.small,
        'h-[70px]': !props.small,
      },
      {
        '!w-[30px]': props.small,
        '!min-w-[30px]': props.small,
        'h-[30px]': props.small,
      },
    ]"
  >
    <span
      v-if="['mp4', 'mkv'].includes(props.item.type)"
      :class="[
        'font-semibold',
        { 'text-xs': !props.small, 'text-[8px]': props.small },
      ]"
    >
      {{ props.item.type.toUpperCase() }}
    </span>
    <img
      v-else-if="['pdf', 'csv', 'doc', 'xls', 'txt'].includes(props.item.type)"
      :class="[{ 'w-[10px]': props.small }]"
      :src="imgUrl"
      alt=""
    />
    <template v-else>
      <Icon
        :class="[{ 'text-[24px]': !props.small, 'text-[10px]': props.small }]"
        :icon="icon"
      />
    </template>
  </div>
</template>
