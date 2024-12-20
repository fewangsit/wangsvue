<script setup lang="ts">
import TaskAttachment from '../sections/Attachment/Attachment.vue';
import TaskChecklist from '../sections/Checklist/Checklist.vue';
import TaskDescription from '../sections/Description/Description.vue';
import TaskLink from '../sections/TaskLink/TaskLink.vue';
import TaskApi from '../sections/API/API.vue';
import { computed, inject, Ref } from 'vue';
import { TaskDetailData } from 'lib/types/task.type';

const taskDetail = inject<Ref<TaskDetailData>>('taskDetail');

const isTaskAPI = computed(() =>
  ['Create API', 'API Spec'].includes(taskDetail.value?.process?.name),
);
</script>

<template>
  <div data-wv-section="detailtask-description-tab">
    <div class="flex flex-col gap-6">
      <TaskDescription />
      <TaskAttachment />
      <TaskLink />
      <TaskChecklist v-if="!isTaskAPI" />
      <TaskApi v-if="isTaskAPI" />
    </div>
  </div>
</template>
