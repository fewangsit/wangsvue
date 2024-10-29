<script setup lang="ts">
import { inject, onMounted, Ref, ref } from 'vue';
import Icon from 'lib/components/icon/Icon.vue';
import Changelog from 'lib/components/changelog/Changelog.vue';
import Button from 'lib/components/button/Button.vue';
import AttachmentItem from './TaskAttachmentItem.vue';
import { AttachmentItemData } from './TaskAttachmentItem.vue.d';
import DialogAddAttachment from './Dialog/DialogAddAttachment.vue';
import TaskAttachmentServices from 'lib/services/taskAttachment.service';

onMounted(() => {
  getAttachments();
});

const taskId = inject<Ref<string>>('taskId');

const attachments = ref<AttachmentItemData[]>([]);

const dialogAddAttachment = ref(false);

const getAttachments = async (): Promise<void> => {
  try {
    const { data: response } = await TaskAttachmentServices.getTaskAttachments(
      taskId.value,
    );
    attachments.value = response.data;
  } catch (error) {
    console.error(error);
  }
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
        <Changelog object="objects" />
        <Button
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
</template>
