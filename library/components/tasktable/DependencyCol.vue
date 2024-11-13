<script setup lang="ts">
import { TaskTableItemDependency } from 'lib/types/task.type';
import Icon from '../icon/Icon.vue';

const props = defineProps<{
  dependency: TaskTableItemDependency;
}>();
</script>

<template>
  <div class="flex gap-2.5">
    <div class="flex items-center gap-1">
      <span>{{ props.dependency.done }}</span>
      <Icon
        class="w-5 h-5 text-xl"
        icon="checkbox-circle-fill"
        severity="success"
      />
    </div>
    <div class="flex items-center gap-1">
      <span>{{ props.dependency.onProgress }}</span>
      <Icon
        class="w-5 h-5 text-xl"
        icon="close-circle-fill"
        severity="danger"
      />
    </div>
  </div>
</template>
