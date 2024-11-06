<script setup lang="ts">
import TaskAttachment from '../sections/Attachment/Attachment.vue';
import TaskChecklist from '../sections/Checklist/Checklist.vue';
import TaskDescription from '../sections/Description/Description.vue';
import TaskLink from '../sections/TaskLink/TaskLink.vue';
import TaskApi from '../sections/API/API.vue';
</script>

<template>
  <div data-wv-section="detailtask-description-tab">
    <div class="flex flex-col gap-6">
      <TaskDescription />
      <TaskAttachment />
      <TaskLink />
      <TaskChecklist />
      <TaskApi />
    </div>
  </div>
</template>
