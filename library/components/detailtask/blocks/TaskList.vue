<script setup lang="ts">
import Icon from 'lib/components/icon/Icon.vue';
import { TaskLegend } from './Legend.vue';
import LegendList from './LegendList.vue';

const props = defineProps<{
  /**
   * The Task's parent(s) Legend
   */
  parentTask: TaskLegend[];
}>();
</script>

<template>
  <div data-wv-section="detailtask-tasklist">
    <div class="flex items-center gap-2">
      <Icon class="w-6 h-6" icon="list-ordered" />
      <div class="text-xs font-semibold">Daftar Task</div>
    </div>
    <ul v-if="props.parentTask" class="pl-12 list-disc">
      <li :key="index" v-for="(pTask, index) in props.parentTask">
        <LegendList :legend="pTask" :priority-value="pTask.priorityValue" />
      </li>
    </ul>
  </div>
</template>
