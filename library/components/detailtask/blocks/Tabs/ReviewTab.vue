<script setup lang="ts">
import TaskServices from 'lib/services/task.service';
import { inject, Ref, watch } from 'vue';

const taskId = inject<Ref<string>>('taskId');

const getTaskReview = async (): Promise<void> => {
  try {
    const { data } = await TaskServices.getTaskReview(taskId.value);
    console.log('🚀 ~ getTaskReview ~ data:', data);
  } catch (error) {
    console.error(error);
  }
};

watch(
  taskId,
  (val) => {
    if (val) {
      getTaskReview();
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="">a</div>
</template>
