<script setup lang="ts">
import TaskAttachment from '../TaskAttachment.vue';
import TaskDescription from '../TaskDescription.vue';
import TaskLink from '../TaskLink.vue';
</script>

<template>
  <div data-wv-section="detailtask-description-tab">
    <div class="flex flex-col gap-6">
      <TaskDescription />
      <TaskAttachment />
      <TaskLink />
    </div>
  </div>
</template>
