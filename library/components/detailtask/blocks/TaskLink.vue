<script setup lang="ts">
import Button from 'lib/components/button/Button.vue';
import Icon from 'lib/components/icon/Icon.vue';
import DialogSetTaskLink from './Dialog/DialogSetTaskLink.vue';
import { computed, inject, Ref, ref, watch } from 'vue';
import { TaskDetail, TaskLink } from 'lib/types/task.type';
import { useToast } from 'lib/utils';
import TaskServices from 'lib/services/task.service';
import UserName from 'lib/components/username/UserName.vue';
import { formatTimeAgo } from '@vueuse/core';

const toast = useToast();

const taskId = inject<Ref<string>>('taskId');
const taskDetail = inject<Ref<TaskDetail>>('taskDetail');

const showDialogSetTaskLink = ref<boolean>(false);
const showDialogSetTaskRepositoryLink = ref<boolean>(false);
const showDialogSetTaskMicroserviceLink = ref<boolean>(false);

const taskLink = ref<TaskLink>();
const serviceLink = ref<TaskLink>();

const isProcessHasRepository = computed(() => {
  if (!taskDetail.value) return false;
  return ['Repositori FE', 'Repositori BE'].includes(
    taskDetail.value.process.name,
  );
});

/**
 *
 * - \s*\/?\s* There may be spaces before the name of the tag
 * - (iframe)\b Matches only the whole tag name
 * - .*?> Matching everything to the character >
 *
 * @see <https://stackoverflow.com/questions/59465583/regex-to-whitelist-html-tags>
 */
const whitelistIframeTag = /<\s*\/?\s*(iframe)\b.*?>/;

const getTaskLink = async (): Promise<void> => {
  try {
    if (!taskId.value) return;

    const { data: taskData } = await TaskServices.getTaskLink(
      taskId.value,
      'task',
    );
    const { data: serviceData } = await TaskServices.getTaskLink(
      taskId.value,
      'service',
    );

    taskLink.value = taskData.data;
    serviceLink.value = serviceData.data;
  } catch (error) {
    console.error(error);
    toast.add({
      message: 'Data Task Link gagal diambil.',
      severity: 'error',
      error,
    });
  }
};

watch(taskDetail, async () => {
  await getTaskLink();
});
</script>

<template>
  <template v-if="isProcessHasRepository">
    <div
      class="flex flex-col gap-2"
      data-wv-section="detailtask-task-repository-link"
    >
      <DialogSetTaskLink
        v-model:visible="showDialogSetTaskRepositoryLink"
        :initial-value="taskLink"
        type="repositori"
      />
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Icon class="w-6 h-6" icon="link" />
          <div class="text-xs font-semibold">Link Repositori</div>
        </div>
        <div class="flex items-center gap-2">
          <span v-if="taskLink?.updatedAt">
            {{ formatTimeAgo(new Date(taskLink.updatedAt)) }}
          </span>
          <UserName
            v-if="taskLink?.updatedBy"
            :user="taskLink.updatedBy"
            type="icon"
          />
          <!-- TODO: Handle chat icon on click -->
          <Button
            class="!p-1"
            icon="chat-1-line"
            icon-class="!w-6 !h-6"
            severity="secondary"
            text
          />
          <!-- TODO: Handle task link changelog on click -->
          <Button
            class="!p-1"
            icon="file-history"
            icon-class="!w-6 !h-6"
            severity="secondary"
            text
          />
          <Button
            :label="taskLink ? 'Edit Link' : 'Link Task'"
            @click="showDialogSetTaskRepositoryLink = true"
            icon="add"
            severity="secondary"
          />
        </div>
      </div>
      <div v-if="taskLink" class="pl-8">
        <a :href="taskLink.link" class="text-link" target="_blank">
          {{ taskLink.link }}
        </a>
      </div>
    </div>
    <div
      class="flex flex-col gap-2"
      data-wv-section="detailtask-task-microservices-link"
    >
      <DialogSetTaskLink
        v-model:visible="showDialogSetTaskMicroserviceLink"
        :initial-value="serviceLink"
        type="microservices"
      />
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Icon class="w-6 h-6" icon="link" />
          <div class="text-xs font-semibold">Link Micro Services</div>
        </div>
        <div class="flex items-center gap-2">
          <span v-if="serviceLink?.updatedAt">
            {{ formatTimeAgo(new Date(serviceLink.updatedAt)) }}
          </span>
          <UserName
            v-if="serviceLink?.updatedBy"
            :user="serviceLink.updatedBy"
            type="icon"
          />
          <!-- TODO: Handle chat icon on click -->
          <Button
            class="!p-1"
            icon="chat-1-line"
            icon-class="!w-6 !h-6"
            severity="secondary"
            text
          />
          <!-- TODO: Handle task link changelog on click -->
          <Button
            class="!p-1"
            icon="file-history"
            icon-class="!w-6 !h-6"
            severity="secondary"
            text
          />
          <Button
            :label="serviceLink ? 'Edit Link' : 'Task Link'"
            @click="showDialogSetTaskMicroserviceLink = true"
            icon="add"
            severity="secondary"
          />
        </div>
      </div>
      <div v-if="serviceLink" class="pl-8">
        <a :href="serviceLink.link" class="text-link" target="_blank">
          {{ serviceLink.link }}
        </a>
      </div>
    </div>
  </template>
  <div
    v-else
    class="flex flex-col gap-2"
    data-wv-section="detailtask-task-link"
  >
    <DialogSetTaskLink
      v-model:visible="showDialogSetTaskLink"
      :initial-value="taskLink"
    />
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Icon class="w-6 h-6" icon="link" />
        <div class="text-xs font-semibold">Link Task</div>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="taskLink?.updatedAt">
          {{ formatTimeAgo(new Date(taskLink.updatedAt)) }}
        </span>
        <UserName
          v-if="taskLink?.updatedBy"
          :user="taskLink.updatedBy"
          type="icon"
        />
        <!-- TODO: Handle chat icon on click -->
        <Button
          class="!p-1"
          icon="chat-1-line"
          icon-class="!w-6 !h-6"
          severity="secondary"
          text
        />
        <!-- TODO: Handle task link changelog on click -->
        <Button
          class="!p-1"
          icon="file-history"
          icon-class="!w-6 !h-6"
          severity="secondary"
          text
        />
        <Button
          :label="taskLink ? 'Edit Link' : 'Link Task'"
          @click="showDialogSetTaskLink = true"
          icon="add"
          severity="secondary"
        />
      </div>
    </div>
    <div v-if="taskLink" class="pl-8">
      <a
        v-if="taskLink.linkType === 'url'"
        :href="taskLink.link"
        class="text-link"
        target="_blank"
      >
        {{ taskLink.link }}
      </a>
      <template v-else-if="taskLink.linkType === 'embedded'">
        <div
          v-if="whitelistIframeTag.test(taskLink.link)"
          v-html="taskLink.link"
          class="[&_iframe]:flex-grow flex w-full h-full"
        />
        <!-- TODO: Desain kode embed tidak valid -->
        <div v-else>
          <span class="font-bold text-lg">
            Oh Tidak! kode embed tidak valid.
          </span>
        </div>
      </template>
    </div>
  </div>
</template>
