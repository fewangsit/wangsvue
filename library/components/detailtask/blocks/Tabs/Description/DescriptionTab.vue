<script setup lang="ts">
import TaskAttachment from './Attachment/Attachment.vue';
import TaskChecklist from './Checklist/Checklist.vue';
import TaskDescription from './Description/Description.vue';
import TaskLink from './TaskLink/TaskLink.vue';
import TaskApi from './API/API.vue';
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
