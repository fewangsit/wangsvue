<script setup lang="ts">
import { TaskLegend } from './Legend.vue';
import Button from 'lib/components/button/Button.vue';

const props = withDefaults(
  defineProps<{
    /**
     * The Task's Legend
     */
    legend: TaskLegend;

    /**
     * The Task's priority value
     */
    priorityValue?: number;

    /**
     * Whether to give the legend list bold style
     */
    bold: boolean;
  }>(),
  {
    bold: false,
    priorityValue: undefined,
  },
);
</script>

<template>
  <div
    :class="[
      'flex items-center gap-2 text-xs leading-4',
      { 'font-semibold': props.bold },
    ]"
    data-wv-section="detailtask-legend-list"
  >
    <span v-if="props.legend.process"> {{ props.legend.process.name }}. </span>
    <span v-if="props.legend.module"> {{ props.legend.module.name }}. </span>
    <span v-if="props.legend.subModule">
      {{ props.legend.subModule.name }}.
    </span>
    <span v-if="props.legend.title ?? props.legend.name">
      {{ props.legend.title ?? props.legend.name }}
    </span>
    <Button
      v-if="props.priorityValue"
      :label="props.priorityValue.toString()"
      class="!min-w-8 !cursor-default !pointer-events-none"
    />
  </div>
</template>
