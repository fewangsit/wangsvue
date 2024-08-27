<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { BadgeProps } from '../badge/Badge.vue.d';
import { SummaryAccordionProps } from './SummaryAccordion.vue.d';
import ProgressBar from 'primevue/progressbar';
import Badge from '../badge/Badge.vue';
import Button from '../button/Button.vue';
import { IconProps, WangsIcons } from '../icon/Icon.vue.d';
import Icon from '../icon/Icon.vue';

interface SummaryItem {
  icon: WangsIcons;
  severity: IconProps['severity'];
  label: string;
  value: string | number;
}

const props = defineProps<SummaryAccordionProps>();

const expanded = shallowRef(false);

const severity = computed<BadgeProps['severity']>(() => {
  switch (props.summary.status) {
    case 'Sprint':
      return 'warning';
    case 'Selesai':
      return 'success';
    case 'Backlog':
    default:
      return 'dark';
  }
});

const progress = computed(() => {
  const {
    totalCompletedTask,
    totalSprintTask,
    totalBacklogTask,
    totalModule,
    totalCompletedModule,
  } = props.summary;

  const totalTask = totalCompletedTask + totalSprintTask + totalBacklogTask;
  const task = Math.round((totalCompletedTask / totalTask) * 100);
  const module = Math.round((totalCompletedModule / totalModule) * 100);

  return {
    task,
    module,
  };
});

const summaryItems = computed<SummaryItem[]>(() => {
  const {
    totalCompletedTask,
    totalSprintTask,
    totalBacklogTask,
    totalSprintPoint,
    totalBugHistories,
    totalModule,
    totalCompletedModule,
  } = props.summary;

  const totalTask = totalCompletedTask + totalSprintTask + totalBacklogTask;

  return [
    {
      icon: 'check-double-fill',
      severity: 'primary',
      label: props.type === 'project' ? 'Progress Modul' : 'Sub Modul',
      value:
        props.type === 'project'
          ? `${progress.value.module}% (${totalCompletedModule}/${totalModule})`
          : totalModule,
    },
    {
      icon: 'check-double-fill',
      severity: 'primary',
      label: 'Progress Task',
      value: `${progress.value.task}% (${totalCompletedTask}/${totalTask})`,
    },
    {
      icon: 'star',
      severity: 'primary',
      label: 'Total Poin',
      value: totalSprintPoint,
    },
    {
      icon: 'list-check',
      severity: 'warning',
      label: 'Task Sprint',
      value: totalSprintTask,
    },
    {
      icon: 'list-check',
      severity: 'success',
      label: 'Task Selesai',
      value: totalCompletedTask,
    },
    {
      icon: 'list-check',
      severity: 'danger',
      label: 'Histori Bug',
      value: totalBugHistories,
    },
  ];
});
</script>
<template>
  <div
    :class="[
      'bg-primary-50 rounded-lg p-3 w-full flex flex-col gap-3 text-grayscale-900',
    ]"
    data-wv-name="projectsummary"
    data-wv-section="root"
  >
    <div class="flex items-center gap-1" data-wv-section="projectmeta">
      <h2
        class="font-semibold text-base leading-4"
        data-wv-section="projectname"
      >
        {{ summary.name }} ({{ summary.initialName }})
      </h2>

      <div class="flex items-center gap-3">
        <ProgressBar
          :show-value="false"
          :value="type === 'project' ? progress.module : progress.task"
          class="w-[20vw] max-w-[200px]"
        />
        <span class="font-medium text-[14px] leading-4">
          {{ type === 'project' ? progress.module : progress.task }}%
        </span>
      </div>

      <Badge :label="summary.status" :severity="severity" />

      <Button
        :class="[
          '!p-0 !m-0 !w-auto !h-auto !ml-auto',
          { 'rotate-180': expanded },
        ]"
        @click="expanded = !expanded"
        icon="arrow-down"
        icon-class="w-6 h-6 text-general-800"
        text
      />
    </div>

    <div
      v-show="expanded"
      :class="['grid grid-cols-3 grid-rows-2 gap-3']"
      data-wv-section="summary"
    >
      <span
        :key="item.label"
        v-for="item of summaryItems"
        class="flex items-center gap-1 text-xs font-normal"
      >
        <Icon :icon="item.icon" :severity="item.severity" />
        <span>{{ item.label }}:</span>
        <span>{{ item.value }}</span>
      </span>
    </div>
  </div>
</template>
