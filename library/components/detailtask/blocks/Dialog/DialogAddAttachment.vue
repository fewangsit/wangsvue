<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import Button from 'lib/components/button/Button.vue';
import Dialog from 'lib/components/dialog/Dialog.vue';
import TabMenu from 'lib/components/tabmenu/TabMenu.vue';
import { MenuItem } from 'lib/components/menuitem';
import Icon from 'lib/components/icon/Icon.vue';
import Form from 'lib/components/form/Form.vue';
import { FormPayload } from 'lib/components/form/Form.vue.d';
import InputText from 'lib/components/inputtext/InputText.vue';
import { FileType } from '../TaskAttachmentItem.vue.d';
import Image from 'lib/components/image/Image.vue';
import TaskAttachmentServices from 'lib/services/taskAttachment.service';
import {
  AddTaskAttachmentFileDTO,
  AddTaskAttachmentUrlDTO,
} from 'lib/dto/taskAttachment.dto';
import axios, { AxiosProgressEvent } from 'axios';
import { useToast } from 'lib/utils';

type FormattedFile = {
  name: string;
  type: string;
  size: number;
  webkitRelativePath: string;
  fileType: FileType;
  file: File;
  imgPreviewURL?: string;
  uploadProgress?: number;
  controller?: AbortController;
  isCanceled?: boolean;
};

const toast = useToast();

const visible = defineModel<boolean>('visible', { required: true });

const emit = defineEmits<{
  hide: [];
}>();

const props = defineProps<{
  taskId: string;
}>();

const menus = shallowRef<MenuItem[]>([
  {
    label: 'Upload',
  },
  {
    label: 'URL',
  },
]);

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB in bytes
const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

const activeIndex = ref(0);

const fileInput = ref<HTMLInputElement | null>(null);
const fileInputKey = ref(0);
const isHighlighted = ref(false);
const files = ref<FormattedFile[]>([]);

/**
 * Checks if a file is under the maximum size limit.
 *
 * @param file The file to be checked.
 * @returns True if the file is under the maximum size limit, false otherwise.
 */
const validateFileSize = (file: File): boolean => {
  if (!file.type?.length) {
    return false;
  }
  const fileType = getFileType(file.type);
  if (fileType === 'video') {
    return file.size <= MAX_VIDEO_SIZE;
  }
  return file.size <= MAX_FILE_SIZE;
};

/**
 * Checks if a file has a valid type.
 * Make sure user doesn't upload a folder.
 *
 * @param file The file to be checked.
 * @returns True if the file has a valid type, false otherwise.
 */
const validateFileType = (file: File): boolean => {
  if (!file.type?.length) {
    return false;
  }
  return true;
};

/**
 * Formats a file into a FormattedFile object.
 *
 * @param file The file to be formatted.
 * @returns A FormattedFile object.
 */
const formatFile = (file: File): FormattedFile => {
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    webkitRelativePath: file.webkitRelativePath,
    fileType: getFileType(file.type),
    file,
    imgPreviewURL:
      getFileType(file.type) === 'image'
        ? URL.createObjectURL(file)
        : undefined,
  };
};

const selectFiles = (): void => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

/**
 * Maps a mime type to a custom file type.
 *
 * @param {string} mimeType
 * @returns {CustomFileType}
 */
const getFileType = (mimeType: string): FileType => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType === 'text/csv') return 'csv';
  if (
    mimeType === 'application/vnd.ms-excel' ||
    mimeType ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
    return 'xls';
  if (
    mimeType === 'application/msword' ||
    mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  )
    return 'doc';
  if (
    mimeType.startsWith('text/html') ||
    mimeType.startsWith('application/x-url')
  )
    return 'link';
  return 'unknown';
};

const highlight = (): void => {
  isHighlighted.value = true;
};

const unhighlight = (): void => {
  isHighlighted.value = false;
};

const handleFiles = async (event: Event): Promise<void> => {
  fileInputKey.value++;
  const input = event.target as HTMLInputElement;
  if (input.files) {
    const selectedFiles = Array.from(input.files).filter(validateFileType);
    const validFiles = selectedFiles.filter(validateFileSize).map(formatFile);
    if (validFiles.length < selectedFiles.length) {
      toast.add({
        severity: 'error',
        message: 'Ukuran file terlalu besar.',
      });
    }
    files.value.push(...validFiles);

    await submitAttachmentFiles(validFiles);
  }
};

const handleDrop = async (event: DragEvent): Promise<void> => {
  fileInputKey.value++;
  if (event.dataTransfer) {
    const droppedFiles = Array.from(event.dataTransfer.files).filter(
      validateFileType,
    );
    const validFiles = droppedFiles.filter(validateFileSize).map(formatFile);
    if (validFiles.length < droppedFiles.length) {
      toast.add({
        severity: 'error',
        message: 'Ukuran file terlalu besar.',
      });
    }
    files.value.push(...validFiles);

    await submitAttachmentFiles(validFiles);
  }
  unhighlight();
};

/**
 * Submits a single attachment to the server.
 *
 * @param {AddTaskAttachmentFileDTO} body - The attachment to submit.
 * @param {number} uploadIndex - The index of the attachment in the array of files to upload.
 * @param {number} uploadLength - The total number of files to upload.
 * @returns {Promise<void>} A promise that resolves when the attachment is submitted successfully.
 */
const addAttachment = async (
  body: AddTaskAttachmentFileDTO,
  uploadIndex: number,
  uploadLength: number,
): Promise<void> => {
  const index = files.value.length - uploadLength + uploadIndex;
  try {
    const controller = new AbortController();
    files.value[index].controller = controller;

    const onUploadProgress = (progressEvent: AxiosProgressEvent): void => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );
      files.value[index].uploadProgress = percentCompleted;

      // eslint-disable-next-line no-undef
      const progressBars: NodeListOf<HTMLElement> =
        document.querySelectorAll('#progress-bar');
      progressBars[index].style.width = percentCompleted + '%';
    };

    await TaskAttachmentServices.addTaskAttachmentFile({
      taskId: props.taskId,
      body: body,
      onUploadProgress: onUploadProgress,
      signal: controller.signal,
    });
  } catch (error) {
    // Handle cancellation
    if (axios.isCancel(error)) {
      files.value[index].isCanceled = true;
      return;
    }
    console.error(error);
  }
};

/**
 * Submits multiple attachments to the server.
 *
 * @param validFiles - An array of formatted file objects, each containing a File object and a fileType string.
 * @returns A promise that resolves if all attachments are submitted successfully, or rejects if any attachment fails.
 */
const submitAttachmentFiles = async (
  validFiles: FormattedFile[],
): Promise<void> => {
  const formattedFiles: AddTaskAttachmentFileDTO[] = validFiles.map((file) => ({
    file: file.file,
    type: file.fileType,
  }));
  try {
    await Promise.all(
      formattedFiles.map(async (file, index) => {
        await addAttachment(file, index, formattedFiles.length);
      }),
    );
  } catch (error) {
    console.error('Error submitting attachments:', error);
  }
};

/**
 * Submits a URL attachment to the server.
 *
 * @param e - Form values, containing `url` and `displayName` fields.
 * @returns A promise that resolves if the attachment is submitted successfully, or rejects if any error occurs.
 */
const submitAttachmentURL = async (e: FormPayload): Promise<void> => {
  try {
    const body: AddTaskAttachmentUrlDTO = {
      url: e.formValues?.url as unknown as string,
      displayName: e.formValues?.displayName as unknown as string,
    };
    const { data } = await TaskAttachmentServices.addTaskAttachmentUrl(
      props.taskId,
      body,
    );
    if (data) {
      visible.value = false;
    }
  } catch (error) {
    console.error(error);
  }
};

const cancelUpload = (index: number): void => {
  files.value[index].controller?.abort();
};

const onHideDialog = (): void => {
  files.value = [];
  emit('hide');
};
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :closable="false"
    @hide="onHideDialog"
    class="w-[400px]"
    header="Attachment"
    modal
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <span class="text-lg font-semibold leading-4">Attachment</span>
        <Button
          @click="visible = false"
          class="!p-0.5 !text-general-200 dark:!text-general-200"
          data-wv-section="closebutton"
          icon="close"
          icon-class="w-[22px] h-[22px]"
          severity="secondary"
          text
        />
      </div>
    </template>
    <template #default>
      <TabMenu v-model:active-index="activeIndex" :menu="menus" />

      <div
        id="upload-drop-area"
        v-if="activeIndex === 0"
        :class="{ 'bg-primary-50': isHighlighted }"
        @dragenter.prevent="highlight"
        @dragleave.prevent="unhighlight"
        @dragover.prevent="highlight"
        @drop.prevent="handleDrop"
        class="flex flex-col gap-4"
      >
        <input
          :key="fileInputKey"
          ref="fileInput"
          @change="handleFiles"
          multiple
          style="display: none"
          type="file"
        />

        <div
          class="flex flex-col gap-2 items-center justify-center border-b border-primary-100 pb-4"
        >
          <Icon class="text-7xl text-primary-400" icon="upload-2" />
          <Button @click="selectFiles" label="Cari File" severity="secondary" />
          <span class="text-xs">atau seret file ke sini</span>
          <div
            class="flex flex-col gap-1 justify-center items-center text-center text-[10px]"
          >
            <span>Ukuran file maksimal: 10 MB (video) & 1 MB (lainnya) </span>
          </div>
        </div>

        <div v-if="files.length" class="flex flex-col gap-2">
          <span class="text-sm font-semibold">Upload Progress</span>
          <div class="flex flex-col gap-1 max-h-[250px] overflow-auto">
            <div
              :key="index"
              v-for="(file, index) in files"
              class="h-[46px] flex justify-center items-center p-2 gap-2 border border-primary-100 rounded-lg"
            >
              <Image
                v-if="file.imgPreviewURL"
                :src="file.imgPreviewURL"
                class="w-[30px] h-[30px] object-cover"
              />
              <Image v-else class="w-[30px]" />
              <div class="w-full flex flex-col gap-1">
                <div class="w-full flex justify-between items-center">
                  <span>{{ file.name }}</span>
                  <span v-if="file.uploadProgress !== 100 && !file.isCanceled">
                    {{ file.uploadProgress }}%
                  </span>
                  <span v-else-if="file.isCanceled" class="text-danger-500">
                    Dibatalkan
                  </span>
                </div>
                <div
                  id="progress-bar-container"
                  v-show="!file.isCanceled"
                  class="w-full h-[2px] bg-general-100"
                >
                  <div
                    id="progress-bar"
                    class="w-0 h-[2px] bg-primary-400 transform transition-all duration-300 ease-in-out"
                  />
                </div>
              </div>
              <template v-if="!file.isCanceled">
                <Button
                  v-if="file.uploadProgress !== 100"
                  @click="cancelUpload(index)"
                  icon="close"
                  severity="danger"
                  text
                />
                <Icon
                  v-else
                  class="text-success-500 text-xl w-[30px]"
                  icon="check"
                />
              </template>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <Form
          :buttons-template="['submit']"
          :reset-after-submit="false"
          @submit="submitAttachmentURL($event)"
          hide-stay-checkbox
          submit-btn-severity="secondary"
        >
          <template #fields>
            <InputText
              v-focus
              :validator-message="{
                empty: 'URL harus diisi',
              }"
              field-name="url"
              label="URL"
              mandatory
              placeholder="Tulis URL"
              use-validator
            />
            <InputText
              field-name="displayName"
              label="Display Text"
              placeholder="Tulis display text"
              use-validator
            />
          </template>
        </Form>
      </div>
    </template>
  </Dialog>
</template>
