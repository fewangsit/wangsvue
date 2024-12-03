<script setup lang="ts">
import { formatDate } from 'lib/utils/date.util';
import { computed, onMounted, onUnmounted, shallowRef, watch } from 'vue';
import { GalleryPreviewProps } from './GalleryPreview.vue.d';
import Button from '../button/Button.vue';

const props = defineProps<GalleryPreviewProps>();

const visible = defineModel<boolean>('visible', { default: false });
const selectedId = defineModel<string>('selectedId');

const currentIndex = shallowRef<number>(0);

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

const closeOverlay = (): void => {
  visible.value = false;
};

const next = (): void => {
  if (!isLast.value) {
    currentIndex.value++;
  }
};

const prev = (): void => {
  if (!isFirst.value) {
    currentIndex.value--;
  }
};

const isFirst = computed(() => currentIndex.value === 0);
const isLast = computed(() => currentIndex.value === props.files.length - 1);

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    closeOverlay();
  } else if (event.key === 'ArrowRight') {
    next();
  } else if (event.key === 'ArrowLeft') {
    prev();
  }
};

watch(visible, (value) => {
  if (value) {
    currentIndex.value = 0;
    if (selectedId.value) {
      const index = props.files.findIndex(
        (image) => image._id === selectedId.value,
      );
      currentIndex.value = index === -1 ? 0 : index;
    }
  }
});
</script>

<template>
  <teleport to="body">
    <transition
      enter-active-class="transition-opacity transition-transform duration-100 ease-out"
      enter-from-class="opacity-0 scale-90"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-opacity transition-transform duration-100 ease-in"
      leave-from-class="opacity-100 scale-90"
      leave-to-class="opacity-25 scale-75"
    >
      <div
        v-if="visible"
        class="fixed backdrop-blur-[1px] inset-0 flex items-center justify-center w-full z-[3205] bg-gray-900 bg-opacity-80 p-6"
      >
        <div
          class="relative flex flex-col gap-3 h-[90vh] self-start w-full items-center justify-between"
        >
          <Button
            @click="closeOverlay"
            class="text-[#908CAB] ml-auto"
            data-wv-section="btn-close"
            icon="close"
            severity="contrast"
            text
          />
          <div class="flex flex-col gap-3 w-full items-center">
            <div class="flex w-full items-center justify-between">
              <Button
                :disabled="isFirst"
                @click="prev"
                class="min-h-[30px] min-w-[30px] transform rotate-180"
                icon="arrow-right"
                icon-class="items-center flex"
              />
              <img
                v-if="props.files[currentIndex].type === 'image'"
                :src="props.files[currentIndex].src"
                alt=""
                class="rounded-lg max-h-[75vh] min-h-[50vh] max-w-[70vw]"
              />
              <iframe
                v-else-if="props.files[currentIndex].type === 'pdf'"
                :src="props.files[currentIndex].src"
                class="border-none w-[75vw] h-[75vh]"
                title="pdf"
              />
              <video
                v-else-if="
                  ['mkv', 'mp4'].includes(props.files[currentIndex].type)
                "
                :src="props.files[currentIndex].src"
                class="border-none w-[75vw] h-[75vh]"
                controls
              />
              <iframe
                v-else-if="
                  ['doc', 'xls'].includes(props.files[currentIndex].type)
                "
                :src="`https://docs.google.com/gview?url=${props.files[currentIndex].src}&embedded=true`"
                class="border-none w-[75vw] h-[75vh]"
                title="doc-excel"
              />
              <span v-else class="text-white">Preview tidak tersedia</span>
              <Button
                :disabled="isLast"
                @click="next"
                class="min-h-[30px] min-w-[30px]"
                icon="arrow-right"
                icon-class="items-center flex"
              />
            </div>
          </div>
          <div
            class="flex flex-col justify-center items-center gap-2 text-white"
          >
            <span class="font-semibold font text-xl">{{
              props.files[currentIndex].name
            }}</span>
            <div class="flex-row flex gap-2 font-normal">
              <span>
                Ditambahkan
                {{
                  props.files[currentIndex].createdAt
                    ? formatDate(new Date(props.files[currentIndex].createdAt))
                    : '-'
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
