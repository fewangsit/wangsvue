<script lang="ts" setup>
import {
  ref,
  watch,
  onUnmounted,
  onMounted,
  reactive,
  shallowRef,
  computed,
} from 'vue';

import BackgroundImageCropper from './BackgroundImageCropper.vue';
import { Cropper, CropperResult } from 'vue-advanced-cropper';
import { useField } from 'vee-validate';
import { FieldValidation } from 'lib/types/validation.type';

import base64toblob from 'base64toblob';
import ImagePreview from 'lib/components/image/Image.vue';
import FieldWrapper from '../fieldwrapper/FieldWrapper.vue';
import Icon from '../icon/Icon.vue';
import Dialog from '../dialog/Dialog.vue';
import Button from '../button/Button.vue';
import ValidatorMessage from '../validatormessage/ValidatorMessage.vue';
import DialogConfirm from '../dialogconfirm/DialogConfirm.vue';

import 'vue-advanced-cropper/dist/style.css';

import type {
  ImageCompressorPayload,
  ImageCompressorProps,
  ImageCompressorEmits,
  Image,
} from './ImageCompressor.vue.d';
import ImageInputInfo from './ImageInputInfo.vue';
import ButtonRadio from 'primevue/radiobutton';

const props = withDefaults(defineProps<ImageCompressorProps>(), {
  disabled: false,
  compressedBlob: undefined,
  imagePreviewSize: 'big',
  mandatory: false,
  useValidator: false,
  validatorMessage: 'Photo must be uploaded',
  showInfo: true,
  showValidatorMessage: true,
  rounded: false,
  imagePreviewUrl: undefined,
  label: undefined,
  fieldName: 'imageInput',
  fieldInfo: undefined,
});

const emit = defineEmits<ImageCompressorEmits>();

onMounted(async () => {
  assignPreviewImagesFromProp();

  setField();

  if (props.imagePreviewUrl) {
    field.value = props.imagePreviewUrl;
  }
});

onUnmounted(() => {
  revokeObjectURL(0);
  revokeObjectURL(1);
});

const image = ref<Image[]>([
  {
    src: null,
    type: null,
  },
  {
    src: null,
    type: null,
  },
]);

const canvas = ref<HTMLCanvasElement>();
const previewImages = ref<(string | Blob | undefined)[]>([]);
const inputImageFile = ref<HTMLInputElement>();
const inputImageFileKey = shallowRef<number>(0);
const vueAdvanceCropper = ref<typeof Cropper>();
// Store the promise resolve function from loadImage function that will be called on applyImageCropper
const resolveFn = ref<(value: void | PromiseLike<void>) => void>();
const currentCropingImageIndex = shallowRef<number>();
const defaultImage = defineModel<number>('defaultImage', { default: 0 });

const field = reactive<
  FieldValidation<File | File[] | string | string[] | undefined>
>({
  value: props.multiple ? [] : undefined,
});

const invalidInput = shallowRef<boolean>(false);
const invalidMessage = shallowRef<string>();

const inputImageKey = shallowRef(0);
const showImageCropper = shallowRef(false);
const showDeleteConfirm = ref<boolean[]>([false, false]);

const assignPreviewImagesFromProp = (): void => {
  if (props.imagePreviewUrl?.length) {
    previewImages.value = Array.isArray(props.imagePreviewUrl)
      ? props.imagePreviewUrl
      : [props.imagePreviewUrl];
  } else if (Array.isArray(props.compressedBlob)) {
    previewImages.value = props.compressedBlob;
  } else {
    previewImages.value = [props.compressedBlob];
  }
};

/**
 * Step 1: User select an image from device.
 */
const pickImage = (addPhoto = false): void => {
  if (props.disabled) return;
  if (addPhoto) currentCropingImageIndex.value = 1;
  inputImageFile.value?.click();
};

const handleImageSelected = async (event: Event): Promise<void> => {
  // Get the image file selected.
  const { files } = event.target as HTMLInputElement;

  const imageFiles = Array.from(files ?? []).slice(
    0,
    previewImages.value.length ? 1 : 2,
  );

  for (const [index, file] of imageFiles.entries()) {
    try {
      const imageIndex = currentCropingImageIndex.value ?? index;

      await loadImage(file, imageIndex); // Wait for each image to load
    } catch (error) {
      console.error('Error loading image:', error);
    } finally {
      currentCropingImageIndex.value = undefined;
    }
  }
};

/**
 * Step 2: On 'change' event, load the image to image cropper.
 */
const loadImage = async (file: File, index: number): Promise<void> => {
  const isImageType = (type: string): boolean => {
    return type.includes('image');
  };

  const isExceededLimit = (size: number): boolean => size > 1000000;

  return new Promise((resolve, reject) => {
    // Ensure that you have a file before attempting to read it
    if (file) {
      resetCropper(index);

      // Check file type
      if (!isImageType(file.type)) {
        invalidInput.value = true;
        invalidMessage.value = 'File type is not image!';
        /*
         * Preview.value = { message: 'File type is not image!' };
         * imageUploadErrorMessage.value = preview.value.message;
         */
        previewImages.value[index] = undefined;
        showImageCropper.value = false;
        revokeObjectURL(index);
        reject('File type is not image!');
      } else if (isExceededLimit(file.size)) {
        invalidInput.value = true;
        invalidMessage.value = 'File size is too big! Max. 1 MB';
        assignPreviewImagesFromProp();
        showImageCropper.value = false;
        revokeObjectURL(index);
        reject('File size is too big! Max. 1 MB');
      } else {
        // 1. Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
        revokeObjectURL(index);

        // 2. Create the blob link to the file to optimize performance:
        const blob = URL.createObjectURL(file);

        /*
         * 3. The steps below are designated to determine a file mime type to use it during the
         * getting of a cropped image from the canvas. You can replace it them by the following string,
         * but the type will be derived from the extension and it can lead to an incorrect result:
         *
         * this.image = {
         *    src: blob;
         *    type: file.type
         * }
         */
        // Create a new FileReader to read this image binary data
        const reader = new FileReader();

        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e): void => {
          // Set the image source (it will look like blob:http://example.com/2c5270a5-18b5-406e-a4fb-07427f5e7b94)
          image.value[index].src = blob;
          // Determine the image type to preserve it during the extracting the image from canvas:
          image.value[index].type = getMimeType(
            e?.target?.result as ArrayBuffer,
            file.type,
          );
        };

        reader.onerror = (e): void => {
          console.error('🚀 ~ returnnewPromise ~ e:', e);
        };

        // Start the reader job - read file as a data url (base64 format)
        reader.readAsArrayBuffer(file);

        // Adjust photo in dialog
        // eslint-disable-next-line eqeqeq
        if (currentCropingImageIndex.value == null)
          currentCropingImageIndex.value = index;
        if (!showImageCropper.value) showImageCropper.value = true;

        invalidInput.value = false;
        invalidMessage.value = undefined;
      }
    }

    inputImageKey.value += 1;

    resolveFn.value = resolve;
  });
};

/**
 * Set field for validation using vee-validate if props.useValidator true.
 * This will store the image to the form values.
 */
const setField = (): void => {
  if (props.useValidator) {
    Object.assign(
      field,
      useField(props.fieldName, (value: string | Blob) => {
        if (!value && props.mandatory) {
          return (props.label ?? 'Photo') + ' must be uploaded';
        } else if (props.invalid && props.validatorMessage) {
          return props.validatorMessage;
        } else if (invalidMessage.value) {
          return invalidMessage.value;
        }

        return true;
      }),
    );
  }
};

const resetCropper = (index: number): void => {
  image.value[index] = {
    src: null,
    type: null,
  };
};

// This function is used to detect the actual image type,
const getMimeType = (
  file: ArrayBuffer | null | undefined,
  fallback: string | null = null,
): string | null => {
  if (file) {
    const byteArray = new Uint8Array(file).subarray(0, 4);
    let header = '';

    for (const element of byteArray) {
      header += element.toString(16);
    }

    switch (header) {
      case '89504e47':
        return 'image/png';
      case '47494638':
        return 'image/gif';
      case 'ffd8ffe0':
      case 'ffd8ffe1':
      case 'ffd8ffe2':
      case 'ffd8ffe3':
      case 'ffd8ffe8':
        return 'image/webp';
      default:
        return fallback;
    }
  }

  return null;
};

// Convert Base64 to Blob
const toBlobObjectURL = (imgUrl: string): string => {
  const blob = base64toblob(imgUrl.split(',')[1], 'image/webp');
  const url = window.URL.createObjectURL(blob);
  return url;
};

/**
 * Convert Blob To File
 * const buildFile = (blob: string, name: string): File =>
 *   new File([blob], name, { type: 'image/webp' });
 */
const blobToFile = async (url: string, name: string): Promise<File> => {
  const blobFile = await fetch(url).then((f) => f.blob());
  return new File([blobFile], name, { type: 'image/webp' });
};

/**
 * Step 3: After user finally crop the image, we will get the result from the cropper
 * and then we will compress the image with the help of canvas and then we will
 * get the compressed image in base64 format.
 */
const applyImageCropper = async (): Promise<void> => {
  const currentImageIndex = currentCropingImageIndex.value ?? 0;

  try {
    await cropImage(currentImageIndex);
  } catch (error) {
    console.error(error);
  }

  closeImageCropper();
};

const closeImageCropper = (): void => {
  showImageCropper.value = false;
  resolveFn.value?.();
  resolveFn.value = undefined;
};

const cropImage = async (index: number): Promise<void> => {
  if (vueAdvanceCropper.value) {
    const croppedImage = vueAdvanceCropper.value.getResult() as CropperResult;

    if (croppedImage.canvas) {
      const base64 = croppedImage.canvas.toDataURL('image/webp');
      await drawCroppedImage(base64, index);
    }
  }
};

const drawCroppedImage = async (
  imageDataURL: string,
  index: number,
): Promise<void> => {
  try {
    // Recreate Canvas Element
    canvas.value = document.createElement('canvas');

    // Set Canvas Context
    const canvasContext = canvas.value.getContext('2d');

    // Create New Image
    const newImage = new Image();
    newImage.src = imageDataURL;
    await newImage.decode();

    // Image Size After Scaling
    const formattedScale = 80 / 100;
    const width = newImage.width * formattedScale;
    const height = newImage.height * formattedScale;

    // Set Canvas Height And Width According to Image Size And Scale
    canvas.value.setAttribute('width', width.toString());
    canvas.value.setAttribute('height', height.toString());

    if (canvasContext) canvasContext.drawImage(newImage, 0, 0, width, height);

    // If all files have been proceed
    const base64 = canvas.value.toDataURL('image/webp', 0.95);
    const fileName = Date.now() + '.webp';

    const imageCompressorPayload: ImageCompressorPayload = {
      canvas: canvas.value,
      compressed: {
        blob: toBlobObjectURL(base64),
        base64,
        fileName,
        file: await blobToFile(toBlobObjectURL(base64), fileName),
        size: '',
        type: 'image/webp',
      },
      message: 'File has been compressed.',
    };

    imageCompressorPayload.compressed.size =
      Math.round(imageCompressorPayload.compressed.file.size / 1000) + 'KB';

    previewImages.value[index] = imageCompressorPayload.compressed.blob;

    if (props.multiple) {
      if (field.value && Array.isArray(field.value)) {
        field.value[index] = imageCompressorPayload.compressed.file;
      } else {
        field.value = [imageCompressorPayload.compressed.file];
      }
    } else {
      field.value = imageCompressorPayload.compressed.file;
    }

    emit('apply', imageCompressorPayload);
  } catch (error) {
    console.error(error);
  }
};

const revokeObjectURL = (index: number): void => {
  // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
  if (image.value[index].src) URL.revokeObjectURL(image.value[index].src);
};

const onBeforeDeleteImage = (index: number): void => {
  if (props.confirmOnDelete) {
    showDeleteConfirm.value[index] = true;
  } else deleteImage(index);
};

const deleteImage = (index = 0): void => {
  invalidInput.value = false;
  invalidMessage.value = undefined;
  previewImages.value = previewImages.value.toSpliced(index, 1);

  revokeObjectURL(index);

  // Swap the image index, because when an image deleted, the second image become the first
  image.value[index] = { src: null, type: null };
  image.value = [image.value[+!index], image.value[index]];

  currentCropingImageIndex.value = 0;
  defaultImage.value = 0;

  if (!props.confirmOnDelete) emit('delete', deleteImage, index);
  if (props.multiple && Array.isArray(field.value)) {
    field.value = field.value.toSpliced(index, 1);
  } else if (field.handleReset) field.handleReset();
};

/**
 * On button edit clicked, checks wether the previewImages is Blob file from user's device,
 * if so, open the cropper again.
 *
 * Otherwise, open the file manager to allow user pick an image.
 */
const editImage = (index: number): void => {
  const currentPreviewImage = previewImages.value[index]?.toString();
  currentCropingImageIndex.value = index;

  if (currentPreviewImage?.includes('blob')) {
    currentCropingImageIndex.value = index;
    showImageCropper.value = true;
  } else {
    resetCropper(index);
    pickImage();
  }
};

/**
 * When user wants to change the image already picked.
 */
const changeImage = (): void => {
  pickImage();
};

const isFirefoxBased = computed(() => {
  return navigator.userAgent.includes('Firefox');
});

watch(invalidMessage, (value) => {
  if (value && field.setErrors) field.setErrors(value);
});

watch(showImageCropper, (value) => {
  if (!value) inputImageFileKey.value++;
});
</script>

<template>
  <FieldWrapper
    :class="[{ '!w-max': !props.multiple, '!w-full': props.multiple }]"
    :info="props.fieldInfo"
    :label="props.label"
    :mandatory="props.mandatory"
    data-wv-name="image-compressor"
    data-wv-section="root"
  >
    <div
      :class="['w-full', { 'grid gap-6 items-start grid-cols-2': multiple }]"
      data-wv-section="wrapper"
    >
      <template v-if="previewImages.length">
        <div
          :key="index"
          v-for="(previewImage, index) of previewImages"
          class="flex gap-1 items-start"
          data-wv-section="preview"
        >
          <div
            class="flex flex-col gap-1"
            data-wv-section="preview-image-wrapper"
          >
            <ImagePreview
              :rounded="rounded"
              :thumbnail="previewImage"
              data-wv-section="preview-image"
            />
            <div
              v-if="!props.disabled"
              class="flex gap-0.5 justify-center"
              data-wv-section="preview-buttons"
            >
              <Button
                @click="editImage(index)"
                class="!py-0.5 !px-1 !h-max text-[11px]"
                icon="pencil"
                label="Edit"
                text
              />
              <Button
                @click="onBeforeDeleteImage(index)"
                class="!py-0.5 !px-1 !h-max text-[11px]"
                icon="delete-bin"
                label="Delete"
                severity="danger"
                text
              />
              <DialogConfirm
                v-model:visible="showDeleteConfirm[index]"
                :closable="false"
                @confirm="emit('delete', deleteImage, index)"
                body="Are you sure you want to delete it?"
                confirm-label="Delete"
                header="Delete Photo"
                severity="danger"
              />
            </div>
          </div>
          <ImageInputInfo
            :show-add-button="previewImages.length === 1 && props.multiple"
            :show-info="showInfo"
            @add-photo="pickImage(true)"
          >
            <ButtonRadio
              v-if="previewImages.length === 2 && props.multiple"
              v-model="defaultImage"
              :label-id="'default-' + index"
              :value="index"
              label="Set as default"
            />
          </ImageInputInfo>
        </div>
      </template>

      <template v-else>
        <div class="flex gap-1 items-start">
          <button
            :class="[
              'w-[125px] h-[125px]',
              'flex items-center justify-center',
              'ring-inset',
              'cursor-pointer',
              {
                'ring-1': isFirefoxBased,
                'ring-[0.5px]': !isFirefoxBased,
              },
              { 'rounded-full': rounded, 'rounded-lg': !rounded },
              {
                'ring-general-200 dark:ring-general-200 focus-visible:ring-primary-500 focus-visible:dark:ring-primary-500':
                  !invalidInput && !field.errorMessage,
                'ring-danger-500 dark:ring-danger-500':
                  invalidInput || field.errorMessage,
              },
              {
                'bg-white dark:bg-grayscale-900': !props.disabled,
                'bg-general-50 dark:bg-grayscale-800': props.disabled,
              },
            ]"
            @click="pickImage(false)"
            data-wv-section="input-image-trigger"
            type="button"
          >
            <Icon
              class="w-6 h-6"
              data-wv-section="trigger-icon"
              icon="image-add"
              severity="primary"
            />
          </button>
          <ImageInputInfo :show-info="showInfo" />
        </div>
      </template>
    </div>

    <input
      :id="fieldName"
      :key="inputImageFileKey"
      ref="inputImageFile"
      :multiple="props.multiple && !previewImages.length"
      @change="handleImageSelected"
      accept="image/*"
      class="hidden"
      data-wv-section="hidden-image-input"
      type="file"
    />
    <ValidatorMessage
      v-if="showValidatorMessage"
      :format="false"
      :message="field.errorMessage ?? invalidMessage"
    />
  </FieldWrapper>

  <Dialog
    v-model:visible="showImageCropper"
    :class="['w-max max-w-[98vw] min-w-[500px] !max-h-[94vh]']"
    :content-class="['overflow-hidden overflow-y-auto min-h-[100px]']"
    :draggable="false"
    :footer-class="['!gap-1']"
    data-wv-section="dialog-cropper"
    header="Adjust Photo"
    modal
  >
    <Cropper
      ref="vueAdvanceCropper"
      v-if="currentCropingImageIndex != null"
      :auto-zoom="false"
      :background-wrapper-component="BackgroundImageCropper"
      :src="image[currentCropingImageIndex].src"
      class="upload-example-cropper h-400"
      foreground-class="h-400"
      image-class="h-400"
    />
    <template #footer>
      <Button
        @click="closeImageCropper"
        label="Cancel"
        plain
        severity="secondary"
        text
      />
      <Button @click="changeImage" label="Change Image" text />
      <Button
        @click="applyImageCropper"
        label="Apply"
        severity="success"
        type="button"
      />
    </template>
  </Dialog>
</template>
