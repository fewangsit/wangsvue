<script setup lang="ts">
import {
  computed,
  inject,
  onMounted,
  reactive,
  ref,
  shallowRef,
  watch,
} from 'vue';
import { useField } from 'vee-validate';
import { useToast } from 'lib/utils';
import { FieldValidation } from 'lib/components/form/Form.vue.d';
import { FileUploadEmits, FileUploadProps } from './FileUpload.vue.d';

import PrimeVueFileUpload from 'primevue/fileupload';
import InputText from 'lib/components/inputtext/InputText.vue';

import FieldWrapper from 'lib/components/fieldwrapper/FieldWrapper.vue';
import TSButton from '../button/Button.vue';

const BYTES_TO_MEGABYTES = 1048576;

const toast = useToast();

const model = defineModel<File>();

const props = withDefaults(defineProps<FileUploadProps>(), {
  label: 'Upload File',
  uploadLabel: 'Upload',
  placeholder: 'Select File',
  withUpload: true,
  useErrorToast: true,
  fieldName: 'fileUpload',
});

const emit = defineEmits<FileUploadEmits>();

const { fileupload: Preset = {} } = inject<Record<string, any>>('preset', {});

const fileName = shallowRef<string>();
const currentFile = shallowRef<File>();

const field = reactive<FieldValidation>({ value: undefined });

const invalidInput = computed(() => {
  return (
    !!field.errorMessage ||
    (errorMessages.value ? errorMessages.value.length > 0 : false)
  );
});

const uploadDisabled = shallowRef<boolean>(false);

onMounted(() => {
  if (props.useValidator) {
    Object.assign(
      field,
      useField(props.fieldName, (value: string) => setValidatorMessage(value)),
    );
  }

  if (model.value) {
    currentFile.value = model.value;
    fileName.value = currentFile.value.name;
  }
});

const setValidatorMessage = (value: string): boolean | string => {
  return !(props.mandatory && !value && !currentFile.value);
};

const selectHandler = (event: { files: File[] }): void => {
  try {
    currentFile.value = event.files[0];
    fileName.value = event.files[0]?.name;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Choose the file to be uploaded
 *
 * @param chooseCallback The FileUploads chooseCallback
 * @param clearCallback The FileUploads clearCallback
 */
const chooseFile = (
  chooseCallback: () => void,
  clearCallback: () => void,
): void => {
  if (props.disabled || uploadDisabled.value) return;

  errorMessages.value = undefined;

  currentFile.value = undefined;
  fileName.value = undefined;

  // eslint-disable-next-line promise/catch-or-return
  new Promise<void>((resolve, reject) => {
    try {
      clearCallback(); // Clear the file in queue.
      resolve();
    } catch (error) {
      reject(error);
    }
    // eslint-disable-next-line promise/prefer-await-to-then,promise/always-return
  }).then(() => {
    // For some reason, we have to wrap it with promise to wait until the clear function is resolved.
    chooseCallback();
  });
};

/**
 * This function process the files to be uploaded.
 *
 * @param files {File[]} The files to be uploaded
 * @param clearCallback The FileUploads clearCallback
 */
const uploadFile = async (
  files: File[],
  clearCallback: () => void,
): Promise<void> => {
  try {
    uploadDisabled.value = true;

    if (props.uploadFunction) await props.uploadFunction(files);

    currentFile.value = undefined;
    fileName.value = undefined;

    clearCallback();

    uploadDisabled.value = false;
  } catch (error) {
    uploadDisabled.value = false;
    throw error;
  }
};

const errorMessages = ref<string[]>();

const getMessages = (messages: string | undefined): void => {
  errorMessages.value = messages as unknown as string[];
};

const onKeydown = (
  ev: KeyboardEvent,
  chooseCallback: () => void,
  clearCallback: () => void,
): void => {
  // Opens File select on enter or space key pressed while the element focused
  if (ev.key === 'Enter' || ev.key === ' ') {
    chooseFile(chooseCallback, clearCallback);
  }
};

watch(currentFile, (file) => {
  field.value = file;
  model.value = file;
});

watch(errorMessages, (message) => {
  if (message && message.length > 0) {
    const errorMessage = message[0]
      .replace('{2}', props.accept ? props.accept : '')
      .replace('{2.1}', props.fileExtensions ? props.fileExtensions : '');

    if (errorMessage.includes('Invalid file size')) {
      emit('error', 'FILE_SIZE_TOO_LARGE');
    }

    if (props.useErrorToast) {
      toast.add({
        message: errorMessage,
        severity: 'error',
      });
    }
  }
});
</script>
<template>
  <PrimeVueFileUpload
    v-bind="props"
    :file-limit="1"
    :pt="{ input: { style: 'display: none' } }"
    @select="selectHandler"
    @upload="$emit('upload', $event)"
  >
    <template #header="{ files, chooseCallback, clearCallback }">
      <div class="grid grid-cols-[auto,max-content] gap-3 items-end">
        <FieldWrapper
          v-bind="Preset.wrapper"
          :error-messages="errorMessages"
          :label="props.label"
          :mandatory="props.mandatory"
        >
          <InputText
            :disabled="props.disabled || uploadDisabled"
            :input-class="Preset.input({ state: { fileName } }).class"
            :invalid="invalidInput"
            :model-value="fileName"
            :placeholder="props.placeholder"
            @click="chooseFile(chooseCallback, clearCallback)"
            @keydown.prevent="onKeydown($event, chooseCallback, clearCallback)"
          >
            <template #addon-left> Browse</template>
          </InputText>
          <div
            v-if="props.fileExtensions || props.fileRequirements"
            v-bind="Preset.requirements"
          >
            <small class="'!mt-0 font-light text-xs text-general-500'">
              <template v-if="fileRequirements">
                {{ fileRequirements }}
              </template>
              <template v-else>
                {{
                  props.maxFileSize
                    ? `${props.fileExtensions}. max file ${Math.round(props.maxFileSize / BYTES_TO_MEGABYTES)} MB`
                    : `${props.fileExtensions} file`
                }}
              </template>
            </small>
          </div>
        </FieldWrapper>
        <template v-if="props.withUpload">
          <TSButton
            v-bind="Preset.buttonupload({ props })"
            :disabled="props.disabled || uploadDisabled || !currentFile"
            :label="props.uploadLabel"
            @click="uploadFile(files, clearCallback)"
            severity="success"
            type="button"
          />
        </template>
      </div>
    </template>
    <template #content="{ messages }">
      {{ getMessages(messages) }}
    </template>
  </PrimeVueFileUpload>
</template>
