<script setup lang="ts">
import { ref } from 'vue';
import UserName from 'lib/components/username/UserName.vue';
import {
  AttachmentItemProps,
  AttachmentItemEmits,
} from './AttachmentItem.vue.d';
import Form from 'lib/components/form/Form.vue';
import { FormPayload } from 'lib/components/form/Form.vue.d';
import InputText from 'lib/components/inputtext/InputText.vue';
import Button from 'lib/components/button/Button.vue';
import TaskAttachmentServices from 'lib/services/taskAttachment.service';
import { UpdateTaskAttachmentCaptionDTO } from 'lib/dto/taskAttachment.dto';
import { formatDateReadable } from 'lib/utils/date.util';
import DialogConfirm from 'lib/components/dialogconfirm/DialogConfirm.vue';
import { useToast } from 'lib/utils';
import TaskAttachmentThumbnail from '../../common/AttachmentThumbnail.vue';
import TaskChecklistServices from 'lib/services/taskChecklist.service';

const toast = useToast();

const props = defineProps<AttachmentItemProps>();
const emit = defineEmits<AttachmentItemEmits>();

const showInputCaption = ref(false);
const dialogConfirmDelete = ref(false);

const submitCaption = async (e: FormPayload): Promise<void> => {
  try {
    const body: UpdateTaskAttachmentCaptionDTO = {
      caption: e.formValues?.caption as unknown as string,
    };
    const { data } = await TaskAttachmentServices.updateTaskAttachmentCaption(
      props.item._id,
      body,
    );
    if (data) {
      emit('updateCaption');
      showInputCaption.value = false;
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteAttachment = async (): Promise<void> => {
  try {
    const { data } =
      props.type === 'attachment'
        ? await TaskAttachmentServices.deleteTaskAttachment(props.item._id)
        : await TaskChecklistServices.deleteTaskAttachment(props.item._id);
    if (data) {
      toast.add({
        message: 'Attachment telah dihapus.',
      });
      emit('deleted');
    }
  } catch (error) {
    toast.add({
      error,
      message: 'Attachment gagal dihapus.',
    });
  }
};

const downloadFile = async (url: string, fileName: string): Promise<void> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob(); // Convert the response to a Blob

    const a = document.createElement('a');
    const urlObject = URL.createObjectURL(blob);
    a.href = urlObject;
    a.download = fileName || url.split('/').pop(); // Use provided fileName or infer from URL
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(urlObject); // Release memory when done
  } catch (error) {
    toast.add({
      error,
      message: 'Attachment gagal didownload.',
    });
  }
};

const truncateText = (text: string): string => {
  return text.length > 32 ? `${text.slice(0, 32)}...` : text;
};
</script>

<template>
  <div v-if="props.type === 'attachment'" class="flex flex-col gap-2">
    <div class="flex justify-between">
      <div class="flex gap-2">
        <TaskAttachmentThumbnail :item="item" />
        <div class="max-w-[430px] flex flex-col gap-1">
          <a
            v-if="item.type === 'link'"
            :href="item.url"
            class="text-xs text-link !text-wrap wrap-text"
            target="_blank"
          >
            {{ item.displayName?.length ? item.displayName : item.url }}
          </a>
          <span v-else class="text-xs font-semibold">
            {{ item.displayName }}
          </span>
          <div class="flex gap-1">
            <a class="cursor-pointer text-primary-400">Komentar</a>
            <span>|</span>
            <a
              @click="showInputCaption = true"
              class="cursor-pointer text-primary-400"
            >
              Caption
            </a>
            <span>|</span>
            <template v-if="item.type !== 'link'">
              <a
                @click="downloadFile(item.url, item.displayName)"
                class="cursor-pointer text-primary-400"
              >
                Download
              </a>
              <span>|</span>
            </template>
            <a
              @click="dialogConfirmDelete = true"
              class="cursor-pointer text-danger-500"
            >
              Hapus
            </a>
          </div>
          <span
            v-if="item.caption && !showInputCaption"
            class="text-grayscale-700"
          >
            {{ item.caption }}
          </span>
        </div>
      </div>
      <div class="flex gap-2 items-start">
        <span class="!text-nowrap">{{
          formatDateReadable(new Date(item.createdAt), 86400)
        }}</span>
        <UserName
          :user="item.createdBy"
          class="text-nowrap"
          type="icon"
          user-name-field="fullName"
        />
      </div>
    </div>
    <div v-if="showInputCaption" class="">
      <Form
        :reset-after-submit="false"
        @submit="submitCaption($event)"
        hide-stay-checkbox
      >
        <template #fields>
          <InputText
            v-focus
            :value="item.caption"
            field-name="caption"
            placeholder="Tulis caption"
            use-validator
          />
          <div class="-mt-1 flex gap-2">
            <Button label="Simpan" severity="success" type="submit" />
            <Button
              @click="showInputCaption = false"
              label="Batal"
              severity="secondary"
              text
              type="button"
            />
          </div>
        </template>
      </Form>
    </div>
  </div>

  <div v-else class="flex flex-col gap-2">
    <div class="flex justify-between">
      <div class="flex gap-2 items-center">
        <TaskAttachmentThumbnail :item="item" small />
        <div class="max-w-[430px] flex flex-col gap-1">
          <a
            v-if="item.type === 'link'"
            :href="item.url"
            class="text-xs"
            target="_blank"
          >
            {{
              item.displayName?.length
                ? truncateText(item.displayName)
                : truncateText(item.url)
            }}
          </a>
          <span v-else class="text-xs">
            {{ truncateText(item.displayName) }}
          </span>
        </div>
      </div>
      <div class="flex gap-2 items-center">
        <Button
          v-if="['image', 'pdf', 'mp4', 'mkv'].includes(item.type)"
          class="!p-1"
          icon="eye"
          icon-class="!w-4 !h-4"
          severity="secondary"
          text
        />
        <Button
          v-if="item.type !== 'link'"
          @click="downloadFile(item.url, item.displayName)"
          class="!p-1"
          icon="download"
          icon-class="!w-4 !h-4"
          severity="secondary"
          text
        />
        <Button
          @click="dialogConfirmDelete = true"
          class="!p-1"
          icon="close"
          icon-class="!w-4 !h-4"
          severity="danger"
          text
        />
      </div>
    </div>
  </div>

  <DialogConfirm
    v-model:visible="dialogConfirmDelete"
    :list="[item.displayName?.length ? item.displayName : item.url]"
    @confirm="deleteAttachment"
    confirm-label="Hapus"
    header="Hapus Attachment"
    message="Apakah kamu yakin ingin menghapusnya?"
    severity="danger"
  />
</template>

<style scoped>
.wrap-text {
  white-space: nowrap;
  word-wrap: break-word; /* Internet Explorer 5.5+ */
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
}
</style>
