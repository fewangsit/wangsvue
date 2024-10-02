<script setup lang="ts">
import Icon from 'lib/components/icon/Icon.vue';
import { TaskLegend } from './Legend.vue';
import LegendList from './LegendList.vue';

const props = defineProps<{
  type: 'parent' | 'child';
  /**
   * The Task's list
   */
  tasks: TaskLegend[];
}>();
</script>

<template>
  <div data-wv-section="detailtask-task-list">
    <div class="flex items-center gap-2">
      <Icon
        :icon="props.type === 'parent' ? 'list-ordered' : 'file-copy-2-line'"
        class="w-6 h-6"
      />
      <div class="text-xs font-semibold">
        {{ props.type === 'parent' ? 'Daftar' : 'Child' }} Task
      </div>
    </div>
    <ul v-if="props.tasks" class="pl-12 list-disc">
      <li :key="index" v-for="(pTask, index) in props.tasks">
        <LegendList :legend="pTask" :priority-value="pTask.priorityValue" />
      </li>
    </ul>
  </div>
</template>
