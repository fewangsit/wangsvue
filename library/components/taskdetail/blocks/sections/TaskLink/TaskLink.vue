<script setup lang="ts">
import {
  computed,
  ComputedRef,
  inject,
  onMounted,
  Ref,
  ref,
  shallowRef,
  watch,
} from 'vue';
import { useToast } from 'lib/utils';
import { formatDateReadable } from 'lib/utils/date.util';
import { WangsitStatus } from 'lib/types/wangsStatus.type';
import { TaskDetailData, TaskLink, TaskLinkType } from 'lib/types/task.type';

import UserName from 'lib/components/username/UserName.vue';
import DialogSetTaskLink from './DialogSetTaskLink.vue';
import TaskLinkChangelog from './TaskLinkChangelog.vue';
import Button from 'lib/components/button/Button.vue';
import Icon from 'lib/components/icon/Icon.vue';
import { TaskLinkServices } from 'wangsit-api-services';

const toast = useToast();

const userType =
  inject<ComputedRef<'member' | 'admin' | 'pm' | 'teamLeader' | 'guest'>>(
    'userType',
  );
const taskId = inject<Ref<string>>('taskId');
const taskDetail = inject<Ref<TaskDetailData>>('taskDetail');
const updateMentionSectionText = inject<(sectionTitle: string) => void>(
  'updateMentionSectionText',
);
const isApproverHasAccess = inject<Ref<boolean>>('isApproverHasAccess');

onMounted(() => {
  getTaskLink();
});

const dialogSetTaskLink = shallowRef<boolean>(false);
const dialogSetTaskRepositoryLink = shallowRef<boolean>(false);
const dialogSetTaskMicroserviceLink = shallowRef<boolean>(false);
const dialogChangelog = shallowRef<boolean>(false);

const taskLink = ref<TaskLink>();
const serviceLink = ref<TaskLink>();

const linkType = ref<TaskLinkType>();

const isDisabled = computed(() => {
  const disabledStatus = (
    ['Selesai', 'Reported Bug'] as WangsitStatus[]
  ).includes(taskDetail.value?.status);

  return (
    disabledStatus || (userType.value === 'guest' && !isApproverHasAccess.value)
  );
});

const isProcessHasRepository = computed(() => {
  if (!taskDetail.value) return false;
  return ['Repositori FE', 'Repositori BE', 'Repositori Mobile'].includes(
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

    const { data: taskData } = await TaskLinkServices.getTaskLink(
      taskId.value,
      'task',
    );
    const { data: serviceData } = await TaskLinkServices.getTaskLink(
      taskId.value,
      'service',
    );

    taskLink.value = taskData.data;
    serviceLink.value = serviceData.data;
  } catch (error) {
    toast.add({
      message: 'Data Task Link gagal dimuat.',
      error,
    });
  }
};

const openChangelog = (type: TaskLinkType): void => {
  linkType.value = type;
  dialogChangelog.value = true;
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
        v-model:visible="dialogSetTaskRepositoryLink"
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
            {{ formatDateReadable(new Date(taskLink.updatedAt), 86400) }}
          </span>
          <UserName
            v-if="taskLink?.updatedBy"
            :user="taskLink.updatedBy"
            type="icon"
          />
          <Button
            @click="updateMentionSectionText('Task Link')"
            class="!p-1"
            icon="chat-1-line"
            icon-class="!w-6 !h-6"
            severity="secondary"
            text
          />
          <Button
            @click="openChangelog('task')"
            class="!p-1"
            icon="file-history"
            icon-class="!w-6 !h-6"
            severity="secondary"
            text
          />
          <Button
            :disabled="isDisabled"
            :label="taskLink ? 'Edit Link' : 'Link Task'"
            @click="dialogSetTaskRepositoryLink = true"
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
        v-model:visible="dialogSetTaskMicroserviceLink"
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
            {{ formatDateReadable(new Date(serviceLink.updatedAt), 86400) }}
          </span>
          <UserName
            v-if="serviceLink?.updatedBy"
            :user="serviceLink.updatedBy"
            type="icon"
          />
          <Button
            @click="updateMentionSectionText('Task Link')"
            class="!p-1"
            icon="chat-1-line"
            icon-class="!w-6 !h-6"
            severity="secondary"
            text
          />
          <Button
            @click="openChangelog('service')"
            class="!p-1"
            icon="file-history"
            icon-class="!w-6 !h-6"
            severity="secondary"
            text
          />
          <Button
            :disabled="isDisabled"
            :label="serviceLink ? 'Edit Link' : 'Task Link'"
            @click="dialogSetTaskMicroserviceLink = true"
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
      v-model:visible="dialogSetTaskLink"
      :initial-value="taskLink"
    />
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Icon class="w-6 h-6" icon="link" />
        <div class="text-xs font-semibold">Link Task</div>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="taskLink?.updatedAt">
          {{ formatDateReadable(new Date(taskLink.updatedAt), 86400) }}
        </span>
        <UserName
          v-if="taskLink?.updatedBy"
          :user="taskLink.updatedBy"
          type="icon"
        />
        <Button
          @click="updateMentionSectionText('Link Task')"
          class="!p-1"
          icon="chat-1-line"
          icon-class="!w-6 !h-6"
          severity="secondary"
          text
        />
        <Button
          @click="openChangelog('task')"
          class="!p-1"
          icon="file-history"
          icon-class="!w-6 !h-6"
          severity="secondary"
          text
        />
        <Button
          :disabled="isDisabled"
          :label="taskLink ? 'Edit Link' : 'Link Task'"
          @click="dialogSetTaskLink = true"
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
        <div v-else>
          <span class="font-bold text-lg">
            Oh Tidak! kode embed tidak valid.
          </span>
        </div>
      </template>
    </div>
  </div>

  <TaskLinkChangelog v-model:visible="dialogChangelog" :type="linkType" />
</template>
