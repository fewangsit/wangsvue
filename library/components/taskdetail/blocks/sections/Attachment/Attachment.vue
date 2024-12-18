<script setup lang="ts">
import {
  computed,
  ComputedRef,
  inject,
  onMounted,
  Ref,
  ref,
  shallowRef,
} from 'vue';
import Icon from 'lib/components/icon/Icon.vue';
import Button from 'lib/components/button/Button.vue';
import AttachmentItem from './AttachmentItem.vue';
import { AttachmentItemData } from './AttachmentItem.vue.d';
import DialogAddAttachment from '../../common/DialogAddAttachment.vue';
import { TaskAttachmentServices } from 'wangsit-api-services';
import AttachmentChangelog from './AttachmentChangelog.vue';
import { useToast } from 'lib/utils';
import { WangsitStatus } from 'lib/types/wangsStatus.type';
import { TaskDetailData } from 'lib/types/task.type';
import GalleryPreview from 'lib/components/gallerypreview/GalleryPreview.vue';
import { File } from 'lib/components/gallerypreview/GalleryPreview.vue.d';

const toast = useToast();

onMounted(() => {
  getAttachments();
});

const userType =
  inject<ComputedRef<'member' | 'admin' | 'pm' | 'teamLeader' | 'guest'>>(
    'userType',
  );
const taskDetail = inject<Ref<TaskDetailData>>('taskDetail');
const taskId = inject<Ref<string>>('taskId');
const isApproverHasAccess = inject<Ref<string>>('isApproverHasAccess');

const attachments = ref<AttachmentItemData[]>([]);

const dialogAddAttachment = shallowRef<boolean>(false);
const dialogChangelog = shallowRef<boolean>(false);

const isDisabled = computed(() => {
  const disabledStatus = (
    ['Selesai', 'Reported Bug'] as WangsitStatus[]
  ).includes(taskDetail.value?.status);

  return (
    disabledStatus || (userType.value === 'guest' && !isApproverHasAccess.value)
  );
});

const getAttachments = async (): Promise<void> => {
  try {
    const { data: response } = await TaskAttachmentServices.getTaskAttachments(
      taskId.value,
    );
    attachments.value = response.data;
    files.value = attachments.value?.map((attachment) => ({
      _id: attachment._id,
      name: attachment.displayName,
      src: attachment.url,
      type: attachment.type,
      createdAt: attachment.createdAt,
    }));
  } catch (error) {
    toast.add({
      error,
      message: 'Attachment gagal dimuat.',
    });
  }
};

const galleryVisible = shallowRef<boolean>(false);
const selectedAttachmentId = ref<string>();
const files = ref<File[]>([]);

const openGallery = (item: AttachmentItemData): void => {
  galleryVisible.value = true;
  selectedAttachmentId.value = item._id;
};
</script>

<template>
  <div class="">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <Icon class="text-2xl" icon="attachment-2" />
        <span class="text-xs font-semibold">Attachment</span>
      </div>
      <div class="flex items-center gap-2">
        <Button
          @click="dialogChangelog = true"
          class="!p-1"
          icon="file-history"
          icon-class="!w-6 !h-6"
          severity="secondary"
          text
        />
        <Button
          :disabled="isDisabled"
          @click="dialogAddAttachment = true"
          icon="add"
          label="Attachment"
          severity="secondary"
        />
      </div>
    </div>
    <div v-show="attachments.length" class="pl-8 py-2 flex flex-col gap-2">
      <AttachmentItem
        :key="index"
        v-for="(item, index) in attachments"
        :item="item"
        @click-item="openGallery"
        @deleted="getAttachments"
        @update-caption="getAttachments"
        type="attachment"
      />
    </div>
  </div>

  <DialogAddAttachment
    v-model:visible="dialogAddAttachment"
    :object-id="taskId"
    :upload-file-service="TaskAttachmentServices.addTaskAttachmentFile"
    :upload-url-service="TaskAttachmentServices.addTaskAttachmentUrl"
    @hide="getAttachments"
    type="attachment"
  />

  <AttachmentChangelog v-model:visible="dialogChangelog" />

  <GalleryPreview
    v-model:selected-id="selectedAttachmentId"
    v-model:visible="galleryVisible"
    :files="files"
  />
</template>
