<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';
import {
  ModuleSummary,
  ProjectSummary,
  SubModuleSummary,
  SummaryAccordionProps,
  SummaryAccordionEmits,
  UserProfileSummary,
} from './SummaryAccordion.vue.d';
import { IconProps, WangsIcons } from '../icon/Icon.vue.d';
import { WangsitStatus } from 'lib/types/wangsStatus.type';
import ProgressBar from '../progressbar/ProgressBar.vue';
import Badge from '../badge/Badge.vue';
import Button from '../button/Button.vue';
import Icon from '../icon/Icon.vue';
import getStatusSeverity from 'lib/utils/statusSeverity.util';
import Skeleton from 'primevue/skeleton';
import ImageCompressor from '../imagecompressor/ImageCompressor.vue';
import ImageCompressorClass from '../imagecompressor/ImageCompressor.vue.d';

interface SummaryItem {
  icon: WangsIcons;
  severity: IconProps['severity'];
  label: string;
  value: string | number;
  show: boolean;
}

const props = withDefaults(defineProps<SummaryAccordionProps>(), {
  fieldName: 'imageInput',
});
defineEmits<SummaryAccordionEmits>();

onMounted(() => {
  shrinkWrap();
  window.addEventListener('resize', shrinkWrap);
});

onUnmounted(() => {
  window.removeEventListener('resize', shrinkWrap);
});

const imageCompressor = ref<ImageCompressorClass>();
const expanded = shallowRef(false);

const name = computed(() => {
  switch (props.summary?.type) {
    case 'module':
      return 'Modul ' + props.summary.name;
    case 'submodule':
      return 'Sub Modul ' + props.summary.name;
    case 'profile':
      return props.summary?.fullName;
    default:
      return props.summary?.name;
  }
});

const progressSubModule = computed(() => {
  const { statusWeb, progressWeb, statusMobile, progressMobile } =
    props.summary?.type === 'submodule'
      ? props.summary
      : ({} as SubModuleSummary);

  if (progressWeb == null || progressMobile == null) return undefined;

  return {
    statusWeb,
    progressWeb,
    statusMobile,
    progressMobile,
  };
});

const progress = computed(() => {
  if (!props.summary) return {};

  const { totalCompletedTask, totalSprintTask, totalBacklogTask } =
    props.summary;

  const { totalModule, totalCompletedModule } =
    props.summary.type === 'project' ? props.summary : ({} as ProjectSummary);

  const totalTask = totalCompletedTask + totalSprintTask + totalBacklogTask;
  const task = Math.floor((totalCompletedTask / (totalTask || 1)) * 100);
  const module = Math.floor((totalCompletedModule / (totalModule || 1)) * 100);

  return {
    task,
    module,
  };
});

const summaryItems = computed<SummaryItem[]>(() => {
  if (!props.summary) return [];

  const {
    totalCompletedTask,
    totalSprintTask,
    totalBacklogTask,
    totalSprintPoint = 0,
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

  const {
    phoneNumber,
    teams,
    email,
    totalSprintTaskDuration,
    sprintPoint = 0,
  } = props.summary.type === 'profile'
    ? props.summary
    : ({} as UserProfileSummary);

  const totalTask = totalCompletedTask + totalSprintTask + totalBacklogTask;

  const sprintDurationText = secondsToDHM(totalSprintTaskDuration);

  const items: SummaryItem[] = [
    {
      icon: 'whatsapp',
      severity: 'primary',
      label: 'Telepon (WA)',
      value: phoneNumber,
      show: props.summary.type === 'profile' && props.summary.completeProfile,
    },
    {
      icon: 'team',
      severity: 'primary',
      label: 'Tim',
      value: teams?.join(', '),
      show: props.summary.type === 'profile' && props.summary.completeProfile,
    },
    {
      icon: 'mail',
      severity: 'primary',
      label: 'Email',
      value: email,
      show: props.summary.type === 'profile' && props.summary.completeProfile,
    },
    {
      icon: 'star',
      severity: 'primary',
      label: 'Progress Poin',
      value: `${Math.floor((sprintPoint / (totalSprintPoint || 1)) * 100)}% (${sprintPoint}/${totalSprintPoint})`,
      show: props.summary.type == 'profile',
    },
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
      icon: 'timer',
      severity: 'primary',
      label: 'Durasi Task Aktif',
      value: sprintDurationText,
      show: props.summary.type === 'profile',
    },
    {
      icon: 'star',
      severity: 'primary',
      label: 'Total Poin',
      value: totalSprintPoint,
      show: props.summary.type != 'profile',
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

const splitItems = computed<SummaryItem[][]>(() => {
  const array = [...summaryItems.value];
  const result = [];

  // Split the items to 3 columns
  for (let i = Math.ceil(array.length) / 3; i > 0; i--) {
    result.push(array.splice(0, Math.ceil(array.length / i)));
  }

  // Transpose the result
  return result[0].map((col, i) => result.map((row) => row[i]));
});

/*
 * Code taken and modified from https://stackoverflow.com/a/78307608/27534858
 * Used to adjust the width of the edited email when it's wrapped
 */
const shrinkWrap = (): void => {
  setTimeout(() => {
    const element = document.getElementById('editedEmail');
    if (!element) return;
    const { firstChild, lastChild } = element;
    if (!firstChild || !lastChild) return;

    element.style.width = '';
    const range = document.createRange();
    range.setStartBefore(firstChild);
    range.setEndAfter(lastChild);

    const { width } = range.getBoundingClientRect();
    element.style.width = width + 'px';
  }, 0);
};

const userStatus = (profile: UserProfileSummary): WangsitStatus =>
  profile.isActive ? 'Aktif' : 'Nonaktif';

const secondsToDHM = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${days}h ${hours}j ${minutes}m`;
};

const assignPreviewImagesFromProp = async (isDelete = false): Promise<void> => {
  imageCompressor.value?.assignPreviewImagesFromProp(isDelete);
};

watch(
  () => summaryItems,
  () => {
    shrinkWrap();
  },
);

watch(
  () => expanded.value,
  () => {
    shrinkWrap();
  },
);

defineExpose({ assignPreviewImagesFromProp });
</script>

<!-- eslint-disable vue/html-indent -->
<template>
  <div
    :class="[
      {
        'grid grid-rows-[max-content,auto] grid-cols-[max-content,1fr] gap-x-3':
          summary?.type === 'profile' && expanded,
      },
      'bg-primary-50 rounded-lg p-3 w-full text-grayscale-900',
    ]"
    data-wv-name="projectsummary"
    data-wv-section="root"
  >
    <template v-if="summary">
      <ImageCompressor
        ref="imageCompressor"
        v-if="summary?.type === 'profile' && expanded"
        :disabled="!summary.completeProfile"
        :field-name="fieldName"
        :image-preview-url="
          summary.useInitial ? undefined : summary.profilePicture
        "
        :initial-name="summary.useInitial ? summary.initial : undefined"
        :show-info="false"
        @apply="$emit('apply', $event)"
        @apply-prop="$emit('applyProp')"
        @delete="$emit('delete', $event)"
        emit-delete-fn
        image-preview-size="medium"
        rounded
        use-validator
      />
      <div class="flex flex-col gap-2">
        <div
          @click="expanded = !expanded"
          class="flex justify-between gap-2 cursor-pointer"
          data-wv-section="projectmeta"
        >
          <div class="flex items-center gap-2">
            <h2
              class="font-semibold text-base leading-4"
              data-wv-section="projectname"
            >
              <template v-if="summary.type === 'profile'">
                {{ name }}
                <span class="font-normal">
                  ({{ summary.position }}, {{ summary.division }})
                </span>
              </template>
              <template v-else-if="summary.type != 'submodule'">
                {{ name }} ({{ summary.initialName }})
              </template>
              <template v-else>
                {{ name }}
              </template>
            </h2>

            <ProgressBar
              v-if="summary.type !== 'profile'"
              :severity="getStatusSeverity(summary.status)"
              :value="progress.task"
              class="w-[20vw] max-w-[200px]"
            />

            <Badge
              :label="
                summary.type === 'profile'
                  ? userStatus(summary)
                  : summary.status
              "
              format="nowrap"
            />

            <span
              v-if="
                summary.type === 'profile' &&
                summary.editable &&
                summary.editedEmail
              "
              class="flex items-center gap-1"
            >
              <p id="editedEmail" class="content-box text-wrap">
                Menunggu perubahan email: {{ summary.editedEmail }}
              </p>
              <Button
                @click.stop="$emit('cancelEditEmail')"
                class="!p-0 !m-0 !w-auto !h-auto"
                icon="close"
                icon-class="w-6 h-6 text-danger-500"
                text
              />
            </span>
          </div>

          <div class="flex items-center gap-2">
            <Button
              v-if="summary?.type === 'profile' && summary.editable"
              @click.stop="$emit('edit')"
              class="!py-0.5"
              label="Edit"
              outlined
              severity="secondary"
            />

            <Button
              :class="[
                '!p-0 !m-0 !w-auto !h-auto',
                {
                  'rotate-180': expanded,
                },
              ]"
              @click.stop="expanded = !expanded"
              icon="arrow-down"
              icon-class="w-6 h-6 text-general-800"
              text
            />
          </div>
        </div>

        <div
          v-if="summary.type === 'submodule' && progressSubModule"
          v-show="expanded"
          class="flex gap-3 items-center"
        >
          <div
            class="grid grid-cols-[max-content,150px,max-content,max-content] items-center gap-2"
          >
            Web
            <ProgressBar
              :severity="
                getStatusSeverity(progressSubModule.statusWeb ?? 'Backlog')
              "
              :show-value="false"
              :value="progressSubModule.progressWeb"
            />
            <span class="font-medium text-[14px] leading-4">
              {{ progressSubModule.progressWeb }}%
            </span>
            <Badge
              :label="progressSubModule.statusWeb ?? 'Backlog'"
              format="nowrap"
            />
          </div>

          <div
            class="grid grid-cols-[max-content,150px,max-content,max-content] items-center gap-2"
          >
            Mobile
            <ProgressBar
              :severity="
                getStatusSeverity(progressSubModule.statusMobile ?? 'Backlog')
              "
              :show-value="false"
              :value="progressSubModule.progressMobile"
            />
            <span class="font-medium text-[14px] leading-4">
              {{ progressSubModule.progressMobile }}%
            </span>
            <Badge
              :label="progressSubModule.statusMobile ?? 'Backlog'"
              format="nowrap"
            />
          </div>
        </div>

        <div
          v-show="expanded"
          class="grid grid-flow-col justify-stretch gap-3"
          data-wv-section="summary"
        >
          <div
            :key="`print${index}`"
            v-for="(items, index) in splitItems"
            class="flex flex-col gap-3"
          >
            <span
              :key="item.label"
              v-for="item in items"
              class="flex items-center gap-1 text-xs font-normal"
            >
              <Icon :icon="item.icon" :severity="item.severity" />
              <span> {{ item.label }}:&nbsp;{{ item.value }} </span>
            </span>
          </div>
        </div>
      </div>
    </template>

    <div
      v-else
      class="grid grid-cols-[3fr,2fr,5fr,1fr,auto,30px] gap-[10px] max-w-[600px]"
    >
      <Skeleton class="!h-[30px]" />
      <Skeleton class="!h-[30px]" />
      <Skeleton class="!h-[30px]" />
      <Skeleton class="!h-[30px]" />
    </div>
  </div>
</template>
