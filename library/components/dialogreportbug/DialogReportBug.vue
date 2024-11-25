<script setup lang="ts">
import { shallowRef, ref, onMounted, onUnmounted } from 'vue';
import imageData from './imageData.json';
import { JSONContent } from '../editor/Editor.vue.d';
import DialogForm from '../dialogform/DialogForm.vue';
import Editor from '../editor/Editor.vue';
import Button from '../button/Button.vue';
import Icon from '../icon/Icon.vue';
import {
  DialogFormPayload,
  DialogFormValue,
} from '../dialogform/DialogForm.vue.d';

const props = defineProps<{
  header?: string;
}>();

const visible = defineModel<boolean>('visible', { default: false });

const emit = defineEmits<{
  close: [];
  submit: [note?: string];
}>();

const editorValue = ref<JSONContent>();

const handleClose = (): void => {
  visible.value = false;
  emit('close');
};

const handleSubmit = (
  values: DialogFormPayload<Record<string, DialogFormValue>>,
): void => {
  emit(
    'submit',
    values?.formValues?.reportBug
      ? JSON.stringify(values.formValues.reportBug)
      : '',
  );
};

const showImageOverlay = shallowRef(false);
const currentIndex = ref(0);

const showPreview = (index: number): void => {
  currentIndex.value = index;
  showImageOverlay.value = true;
};

const closeOverlay = (): void => {
  showImageOverlay.value = false;
};

const nextImage = (): void => {
  if (currentIndex.value < imageData.length - 1) {
    currentIndex.value++;
  }
};

const prevImage = (): void => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    closeOverlay();
  } else if (event.key === 'ArrowRight') {
    nextImage();
  } else if (event.key === 'ArrowLeft') {
    prevImage();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <DialogForm
    v-model:visible="visible"
    :buttons-template="['submit', 'cancel']"
    :close-on-submit="false"
    :header="props.header ?? 'Report Bug'"
    @close="handleClose"
    @hide="editorValue = undefined"
    @submit="handleSubmit"
    submit-btn-label="Kirim"
    width="large"
  >
    <template #fields>
      <div>
        <span class="flex flex-row gap-2 items-center">
          <Icon class="text-primary-400" icon="information-line" />
          <h5 class="font-bold">Kelengkapan data Report Bug</h5>
        </span>
        <ul class="list-disc list-inside font-normal text-xs pl-8">
          <li class="list-item">
            Menyertakan akun yang digunakan dan keterangan role-nya.
          </li>
          <li class="list-item">
            Disarankan tidak merubah kondisi atau skenario terakhir ketika bug.
          </li>
          <li class="list-item">
            Menyertakan screenshoot inspect element (Devtools)
          </li>
          <ul class="list-disc list-inside pl-5">
            <li class="list-item">
              Console
              <span
                @click.prevent="showPreview(0)"
                class="text-primary-400 cursor-pointer hover:underline"
              >
                Lihat Contoh
              </span>
            </li>
            <li class="list-item">Network</li>
            <ul class="list-disc list-inside pl-5">
              <li class="list-item">
                Header
                <span
                  @click.prevent="showPreview(1)"
                  class="text-primary-400 cursor-pointer hover:underline"
                >
                  Lihat Contoh
                </span>
              </li>
              <li class="list-item">
                Payload
                <span
                  @click.prevent="showPreview(2)"
                  class="text-primary-400 cursor-pointer hover:underline"
                >
                  Lihat Contoh
                </span>
              </li>
              <li class="list-item">
                Response
                <span
                  @click.prevent="showPreview(3)"
                  class="text-primary-400 cursor-pointer hover:underline"
                >
                  Lihat Contoh
                </span>
              </li>
            </ul>
          </ul>
          <li class="list-item">
            Menyertakan akun yang digunakan dan keterangan role-nya.
          </li>
        </ul>
      </div>

      <div>
        <Editor
          v-model="editorValue"
          field-name="reportBug"
          is-image-upload-base64
          use-validator
        />
      </div>
    </template>
  </DialogForm>

  <teleport to="body">
    <transition
      enter-active-class="transition-opacity transition-transform duration-500 ease-out"
      enter-from-class="opacity-0 scale-90"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-opacity transition-transform duration-700 ease-in"
      leave-from-class="opacity-100 scale-90"
      leave-to-class="opacity-25 scale-75"
    >
      <div
        v-if="showImageOverlay"
        class="fixed backdrop-blur-[1px] inset-0 flex items-center justify-center w-full z-[3205] bg-gray-900 bg-opacity-80 p-6"
      >
        <div
          class="relative flex flex-col gap-3 h-[568px] self-start w-full items-center"
        >
          <button
            @click="closeOverlay"
            class="text-[#908CAB] ml-auto"
            data-wv-section="btn-close"
          >
            <Icon class="text-[#908CAB] w-6 h-6" icon="close" />
          </button>
          <div class="flex flex-col gap-3 w-full items-center">
            <div class="flex w-full items-center justify-between">
              <Button
                @click="prevImage"
                class="min-h-[30px] min-w-[30px] transform rotate-180"
                icon="arrow-right"
                icon-class="items-center flex"
              />
              <img
                :src="imageData[currentIndex].imgUrl"
                alt="contoh"
                class="w-[932px] h-auto rounded-lg"
              />
              <Button
                @click="nextImage"
                class="min-h-[30px] min-w-[30px]"
                icon="arrow-right"
                icon-class="items-center flex"
              />
            </div>
            <div
              class="flex flex-col justify-center items-center gap-2 text-white"
            >
              <span class="font-semibold font text-xl">{{
                imageData[currentIndex].title
              }}</span>
              <div class="flex-row flex gap-2 font-normal">
                <span> Ditambahkan {{ imageData[currentIndex].date }} </span>
                <span>|</span>
                <span>{{ imageData[currentIndex].size }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
