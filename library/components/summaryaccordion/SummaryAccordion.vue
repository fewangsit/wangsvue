<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import {
  ModuleSummary,
  ProjectSummary,
  SubModuleSummary,
  SummaryAccordionProps,
} from './SummaryAccordion.vue.d';
import ProgressBar from '../progressbar/ProgressBar.vue';
import Badge from '../badge/Badge.vue';
import Button from '../button/Button.vue';
import { IconProps, WangsIcons } from '../icon/Icon.vue.d';
import Icon from '../icon/Icon.vue';
import getStatusSeverity from 'lib/utils/statusSeverity.util';

interface SummaryItem {
  icon: WangsIcons;
  severity: IconProps['severity'];
  label: string;
  value: string | number;
  show: boolean;
}

const props = defineProps<SummaryAccordionProps>();

const expanded = shallowRef(false);

const name = computed(() => {
  switch (props.summary.type) {
    case 'module':
      return 'Modul ' + props.summary.name;
    case 'submodule':
      return 'Sub Modul ' + props.summary.name;
    default:
      return props.summary.name;
  }
});

const progressSubModule = computed(() => {
  const { statusWeb, progressWeb, statusMobile, progressMobile } =
    props.summary.type === 'submodule'
      ? props.summary
      : ({} as SubModuleSummary);

  return {
    statusWeb,
    progressWeb,
    statusMobile,
    progressMobile,
  };
});

const progress = computed(() => {
  const { totalCompletedTask, totalSprintTask, totalBacklogTask } =
    props.summary;

  const { totalModule, totalCompletedModule } =
    props.summary.type === 'project' ? props.summary : ({} as ProjectSummary);

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
  } = props.summary;

  const { totalModule, totalCompletedModule } =
    props.summary.type === 'project' ? props.summary : ({} as ProjectSummary);

  const { totalSubModule } =
    props.summary.type === 'module' ? props.summary : ({} as ModuleSummary);

  const { moduleName } =
    props.summary.type === 'submodule'
      ? props.summary
      : ({} as SubModuleSummary);

  const totalTask = totalCompletedTask + totalSprintTask + totalBacklogTask;

  const items: SummaryItem[] = [
    {
      icon: 'check-double-fill',
      severity: 'primary',
      label: 'Progress Modul',
      value: `${progress.value.module}% (${totalCompletedModule}/${totalModule})`,
      show: props.summary.type === 'project',
    },
    {
      icon: 'check-double-fill',
      severity: 'primary',
      label: 'Sub Modul',
      value: totalSubModule,
      show: props.summary.type === 'module',
    },
    {
      icon: 'file-copy-2-line',
      severity: 'primary',
      label: 'Modul',
      value: moduleName,
      show: props.summary.type === 'submodule',
    },
    {
      icon: 'check-double-fill',
      severity: 'primary',
      label: 'Progress Task',
      value: `${progress.value.task}% (${totalCompletedTask}/${totalTask})`,
      show: true,
    },
    {
      icon: 'star',
      severity: 'primary',
      label: 'Total Poin',
      value: totalSprintPoint,
      show: true,
    },
    {
      icon: 'list-check',
      severity: 'warning',
      label: 'Task Sprint',
      value: totalSprintTask,
      show: true,
    },
    {
      icon: 'list-check',
      severity: 'success',
      label: 'Task Selesai',
      value: totalCompletedTask,
      show: true,
    },
    {
      icon: 'list-check',
      severity: 'danger',
      label: 'Histori Bug',
      value: totalBugHistories,
      show: true,
    },
  ];

  return items.filter((item) => item.show);
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
    <div
      @click="expanded = !expanded"
      class="flex items-center gap-[10px] cursor-pointer"
      data-wv-section="projectmeta"
    >
      <h2
        class="font-semibold text-base leading-4"
        data-wv-section="projectname"
      >
        {{ name }} ({{ summary.initialName }})
      </h2>

      <div class="flex items-center gap-2">
        <ProgressBar
          :severity="getStatusSeverity(summary.status)"
          :show-value="false"
          :value="progress.task"
          class="w-[20vw] max-w-[200px]"
        />
        <span class="font-medium text-[14px] leading-4">
          {{ progress.task }}%
        </span>
      </div>

      <Badge :label="summary.status" format="nowrap" />

      <Button
        :class="[
          '!p-0 !m-0 !w-auto !h-auto !ml-auto',
          { 'rotate-180': expanded },
        ]"
        @click.stop="expanded = !expanded"
        icon="arrow-down"
        icon-class="w-6 h-6 text-general-800"
        text
      />
    </div>

    <div
      v-if="summary.type === 'submodule'"
      v-show="expanded"
      class="flex gap-3 items-center"
    >
      <div
        class="grid grid-cols-[max-content,150px,max-content,max-content] items-center gap-2"
      >
        Web
        <ProgressBar
          :severity="getStatusSeverity(progressSubModule.statusWeb)"
          :show-value="false"
          :value="progressSubModule.progressWeb"
        />
        <span class="font-medium text-[14px] leading-4">
          {{ progressSubModule.progressWeb }}%
        </span>
        <Badge :label="progressSubModule.statusWeb" format="nowrap" />
      </div>

      <div
        class="grid grid-cols-[max-content,150px,max-content,max-content] items-center gap-2"
      >
        Mobile
        <ProgressBar
          :severity="getStatusSeverity(progressSubModule.statusMobile)"
          :show-value="false"
          :value="progressSubModule.progressMobile"
        />
        <span class="font-medium text-[14px] leading-4">
          {{ progressSubModule.progressMobile }}%
        </span>
        <Badge :label="progressSubModule.statusMobile" format="nowrap" />
      </div>
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
