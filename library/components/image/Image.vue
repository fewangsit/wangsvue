<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, shallowRef } from 'vue';
import { ImageProps } from './Image.vue.d';
import { getImageURL, genPlaceholder } from 'lib/utils';

import Image from 'primevue/image';
import Icon from '../icon/Icon.vue';
import Button from '../button/Button.vue';

const ImagePreset = inject<Record<string, any>>('preset', {}).image;

const props = withDefaults(defineProps<ImageProps>(), {
  rounded: false,
});

onMounted(() => {
  setTimeout(() => {
    startInterval();
  }, 3000);
});

onUnmounted(() => {
  stopInterval();
});

const Placeholder = genPlaceholder('WS', 125).toDataURL();
const currentGalleryImage = shallowRef<number>(0);
const intervalId = shallowRef<number>();
const timeOutId = shallowRef<number>();
const errorLoadImage = shallowRef<boolean>(false);

const usePreview = computed(() => {
  return (
    !errorLoadImage.value &&
    !imageThumbnail.value?.toString().includes('data:image/png;base64')
  );
});

const nextImage = (): void => {
  const images = props.galleries ?? [];
  currentGalleryImage.value = (currentGalleryImage.value + 1) % images.length;
  handleThumbnailClick();
};

const prevImage = (): void => {
  const images = props.galleries ?? [];

  currentGalleryImage.value =
    (currentGalleryImage.value - 1 + images.length) % images.length;

  handleThumbnailClick();
};

const startInterval = (): void => {
  stopInterval();

  if (props.galleries?.length) {
    intervalId.value = window.setInterval(() => {
      const images = props.galleries ?? [];
      currentGalleryImage.value =
        (currentGalleryImage.value + 1) % images.length;
    }, 3000);
  }
};

const stopInterval = (): void => {
  if (intervalId.value) {
    window.clearInterval(intervalId.value);
    intervalId.value = undefined;
  }
};

const imageSize = computed(() => {
  if (props.width != null) return props.width;
  else if (props.size === 'small') return 30;
  else if (props.size === 'medium') return 80;
  return 125;
});

const imageThumbnail = computed((): string | Blob | undefined => {
  if (!props.src || errorLoadImage.value) return Placeholder;
  if (typeof props.src === 'string') {
    return props.src.includes('http') ||
      props.src.includes('data:image/png;base64')
      ? props.src
      : getImageURL(props.src, imageSize.value);
  }

  return props.src;
});

const imagePreview = computed(() => {
  const preview = imageThumbnail.value;

  if (typeof preview === 'string') {
    const isFromFiles = preview.includes(
      import.meta.env.VITE_APP_WANGSIT_FILES_API,
    );

    return (preview.includes('http') && !isFromFiles) || // From public resource
      preview.includes('data:image/svg+xml') // Thumbnail
      ? preview
      : getImageURL(props.src as string); // Get the full size for preview
  }

  return preview;
});

const handleThumbnailClick = (index?: number): void => {
  stopInterval();
  if (typeof index === 'number') currentGalleryImage.value = index;
  if (timeOutId.value) window.clearTimeout(timeOutId.value);
  else window.setTimeout(startInterval, 3000);
};

const onErrorLoadImage = (e: Event): void => {
  const src = (e.target as HTMLImageElement)?.src;

  if (src === imageThumbnail.value) {
    errorLoadImage.value = true;
  }
};

const getGalleryImageSrc = (src?: string | Blob): string | undefined => {
  const image = src as string;

  if (typeof image === 'string') {
    return image.includes('http') ? image : getImageURL(image);
  }

  return image;
};
</script>

<template>
  <Image
    v-bind="$props"
    :class="[
      ...ImagePreset?.root({ props: $props }).class,
      $props.rounded ? '!rounded-full' : '!rounded-lg',
      '[&:has(:focus)_button]:opacity-50 [&:has(:focus)_button]:bg-header-weak',
      ...(Array.isArray($props.class) ? $props.class : [$props.class]),
      {
        'w-[125px] h-[125px]': size === 'big',
        'w-[30px] h-[30px]': size === 'small',
        'w-[80px] h-[80px]': size === 'medium',
      },
    ]"
    :preview="usePreview"
  >
    <template #image>
      <img
        :class="ImagePreset?.image({ props: $props }).class"
        :onerror="onErrorLoadImage"
        :src="imageThumbnail as unknown as string"
        alt=""
      />
    </template>
    <template #indicatoricon>
      <Icon class="text-white w-6 h-6 opacity-100 max-w-[50%]" icon="eye" />
    </template>
    <template #preview="slotProps">
      <img
        v-if="!galleries?.length"
        :onerror="onErrorLoadImage"
        :src="imagePreview as string"
        :style="slotProps.style"
        alt=""
      />

      <template v-else>
        <img
          :key="index"
          v-show="index === currentGalleryImage"
          v-for="({ src }, index) in galleries"
          :onerror="onErrorLoadImage"
          :src="getGalleryImageSrc(src)"
          :style="slotProps.style"
          alt=""
          data-wv-section="image-gallery"
        />

        <div
          @click.stop=""
          class="fixed bottom-0 left-0 flex justify-center items-center w-full p-4 mx-auto flex-row bg-black/80"
          data-wv-section="gallery-thumbnail"
        >
          <Button
            :class="[
              'text-surface-0 rotate-180 sticky left-0 !w-8 !h-8 [&_i]:w-5 [&_i]:h-5',
              'rounded-full mr-3',
            ]"
            @click="prevImage"
            aria-label="Previous Image"
            data-wv-section="prev-button"
            icon="arrow-right"
            icon-class="w-5 h-5"
            severity="secondary"
            text
          />
          <img
            :key="index"
            v-for="({ src }, index) in galleries"
            :class="[
              'h-10 w-10 object-cover cursor-pointer opacity-50 hover:opacity-100 transition-opacity',
              { '!opacity-100': currentGalleryImage == index },
            ]"
            :onerror="onErrorLoadImage"
            :src="getGalleryImageSrc(src)"
            :style="slotProps.style"
            @click.stop="handleThumbnailClick(index)"
            alt=""
            data-wv-section="thumbnail-image"
          />
          <Button
            :class="[
              'text-surface-0 sticky !w-8 !h-8 [&_i]:w-5 [&_i]:h-5',
              'rounded-full ml-3',
            ]"
            @click="nextImage"
            aria-label="Next Image"
            data-wv-section="next-button"
            icon="arrow-right"
            severity="secondary"
            text
          />
        </div>
      </template>
    </template>
  </Image>
</template>
