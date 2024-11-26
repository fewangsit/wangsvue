<script setup lang="ts">
import {
  computed,
  DefineComponent,
  provide,
  ref,
  onMounted,
  onUnmounted,
  watch,
  inject,
} from 'vue';

import Dialog from 'primevue/dialog';
import Legend, { TaskLegendForm } from './blocks/common/Legend.vue';
import Button from '../button/Button.vue';
import { DetailTaskEmits, DetailTaskProps } from './TaskDetail.vue.d';
import { MenuItem } from '../menuitem';
import TabMenu from '../tabmenu/TabMenu.vue';
import InfoTaskTab from './blocks/Tabs/InfoTaskTab.vue';
import ReviewTab from './blocks/Tabs/ReviewTab.vue';
import { TaskDetailData } from 'lib/types/task.type';
import eventBus from 'lib/event-bus';
import useLoadingStore from '../loading/store/loading.store';
import { useToast } from 'lib/utils';
import TaskServices from 'lib/services/task.service';
import DescriptionTab from './blocks/Tabs/DescriptionTab.vue';
import TaskMore from './blocks/common/TaskMore.vue';
import ProjectServices from 'lib/services/project.service';
import { ProjectDetail } from 'lib/types/project.type';

import TaskDetail from './TaskDetail.vue';
import Comment from '../comment/Comment.vue';
import { User } from 'lib/types/user.type';
import EventLogTab from './blocks/Tabs/EventLogTab.vue';
import { MentionSectionFunc } from '../comment/Comment.vue.d';

const DialogPreset = inject<Record<string, any>>('preset', {}).dialog;

const { setLoading } = useLoadingStore();
const toast = useToast();

const visible = defineModel<boolean>('visible', { required: true });

const props = withDefaults(defineProps<DetailTaskProps>(), {
  taskId: undefined,
});

const emit = defineEmits<DetailTaskEmits>();

type TaskMenu = MenuItem & {
  component: DefineComponent<any, any, any>;
};

onMounted(async () => {
  attachEventListener();
});

onUnmounted(() => {
  removeEventListener();
});

const userType = computed(() => {
  const { permission } = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = Object.values(permission?.manageProject || {}).every(
    (value) => value === true,
  );
  const { isPM } = projectDetail.value ?? {};

  if (isAdmin) {
    return 'admin';
  } else if (isPM) {
    return 'pm';
  } else if (isProcessTeamLeader.value) {
    return 'teamLeader';
  } else if (isMember.value) {
    return 'member';
  }
  return 'guest';
});

const isProcessTeamLeader = computed(() => {
  const { leaders } = projectDetail.value ?? {};
  const processTeam = legendForm.value?.process?.team?.[0]?.initial;
  const isLeader = processTeam
    ? leaders?.length && leaders?.includes(processTeam)
    : false;
  return isLeader;
});

const isMember = computed(() => {
  return user.value?._id
    ? !!taskDetail.value?.assignedTo.find(
        (assigned) => assigned._id === user.value?._id,
      )
    : false;
});

const user = ref<User>(
  JSON.parse(localStorage.getItem('user') as string) ?? {},
);

/**
 * To be used for the first initial loading.
 */
const firstFetch = ref<boolean>(true);
const taskId = ref<string>();
const projectId = ref<string>();
const taskDetail = ref<TaskDetailData>();
const isNewTask = ref<boolean>(false);
const taskMenuIndex = ref<number>(0);

const projectDetail = ref<ProjectDetail>();

const legendForm = ref<TaskLegendForm>({});

const loadingTask = ref(false);

const dialogDetailTask = ref(false);
const selectedTaskId = ref<string>();

const showCommentSection = ref(false);

const taskMenuKey = ref(0);

const mentionSectionFunc = ref<MentionSectionFunc>();

const mentionedSectionText = ref<string>();

const taskMenu = computed<TaskMenu[]>(() => {
  return [
    {
      label: 'Info Task',
      disabled: isNewTask.value,
      component: InfoTaskTab,
    },
    {
      label: 'Deskripsi',
      disabled: isNewTask.value,
      component: DescriptionTab,
    },
    {
      label: 'Review',
      disabled: isNewTask.value,
      component: ReviewTab,
    },
    {
      label: 'Event Log',
      disabled: isNewTask.value,
      component: EventLogTab,
    },
  ];
});

const openDetailTask = (taskIdParam: string): void => {
  selectedTaskId.value = taskIdParam;
  dialogDetailTask.value = true;
  visible.value = false;
};

const toggleCommentSection = (): void => {
  showCommentSection.value = !showCommentSection.value;
};

const getProjectDetail = async (): Promise<void> => {
  try {
    const { data } = await ProjectServices.getProjectDetail(props.projectId);
    projectDetail.value = data.data;
  } catch (error) {
    toast.add({
      message: 'Gagal memuat proyek detail.',
      error,
    });
  }
};

const getDetailTask = async (): Promise<void> => {
  try {
    loadingTask.value = true;

    if (!taskId.value && !props.taskId) return;

    const { data } = await TaskServices.getTaskDetail(
      taskId.value ?? props.taskId,
    );

    // Parse task detail data to synchronize legend form data.
    taskDetail.value = {
      ...data.data,
      process: {
        _id: data.data.process._id,
        name: data.data.process.name,
        team: data.data.team.map((team) => ({
          initial: team,
        })),
      },
      module: {
        _id: data.data.module._id,
        name: data.data.module.name,
      },
    };

    taskId.value = data.data._id;
  } catch (error) {
    toast.add({
      message: 'Data Task Detail gagal diambil.',
      severity: 'error',
      error,
    });
  } finally {
    loadingTask.value = false;
  }
};

const refreshAndEmitHandler = async (
  eventName: keyof DetailTaskEmits,
  id?: string,
): Promise<void> => {
  try {
    // Skip this function if id doesn't equal the task id.
    if (id !== taskId.value || !taskId.value) return;

    if (eventName === 'delete') {
      emit('delete');
      visible.value = false;
      return;
    }

    if (firstFetch.value) setLoading(true);

    await getDetailTask();
    await getProjectDetail();

    firstFetch.value = false;
    setLoading(false);

    switch (eventName) {
      case 'show':
        emit('show');
        break;
      case 'create':
        emit('create');
        break;
      case 'update':
        emit('update');
        taskMenuKey.value++;
        break;
    }
  } catch (error) {
    console.error(error);
  }
};

const attachEventListener = (): void => {
  eventBus.on('detail-task:show', (event) =>
    refreshAndEmitHandler('show', event.taskId),
  );
  eventBus.on('detail-task:create', (event) =>
    refreshAndEmitHandler('create', event.taskId),
  );
  eventBus.on('detail-task:update', (event) =>
    refreshAndEmitHandler('update', event.taskId),
  );
  eventBus.on('detail-task:delete', (event) =>
    refreshAndEmitHandler('delete', event.taskId),
  );
};

const removeEventListener = (): void => {
  eventBus.off('detail-task:show');
  eventBus.off('detail-task:create');
  eventBus.off('detail-task:update');
};

const handleShow = (): void => {
  projectId.value = props.projectId;

  if (props.taskId) {
    taskId.value = props.taskId;
  } else {
    isNewTask.value = true;
  }

  eventBus.emit('detail-task:show', { taskId: taskId.value });
};

/**
 * Reset dialog state
 */
const reset = (): void => {
  firstFetch.value = true;
  taskMenuIndex.value = 0;
  taskId.value = undefined;
  taskDetail.value = undefined;
  legendForm.value = {};
  isNewTask.value = false;
  showCommentSection.value = false;
};

const updateMentionedSectionText = (sectionTitle: string): void => {
  mentionedSectionText.value = sectionTitle;
};

provide('projectId', projectId);
provide('taskId', taskId);
provide('taskDetail', taskDetail);
provide('isNewTask', isNewTask);
provide('userType', userType);
provide('isProcessTeamLeader', isProcessTeamLeader);
provide('isMember', isMember);
provide('legendForm', legendForm);
provide('loadingTask', loadingTask);
provide('openDetailTask', openDetailTask);
provide('toggleCommentSection', toggleCommentSection);
provide('mentionAction', mentionSectionFunc);
provide('updateMentionSectionText', updateMentionedSectionText);

watch(
  () => props.taskId,
  () => {
    if (props.taskId) {
      taskId.value = props.taskId;
    } else {
      isNewTask.value = true;
    }
  },
);
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :closable="false"
    :draggable="false"
    :pt="{
      root: () => ({
        'class': [
          ...DialogPreset.root({ state: {} }).class,

          //   Customs
          '!w-auto',
          // '!h-[648px]',
          '!max-w-none',
          '!border-grayscale-900 !border',
          '!p-0',
          '!gap-0',
        ],
        'data-wv-section': $attrs['data-wv-section'] ?? 'root',
        'data-wv-name': $attrs['data-wv-name'] ?? 'detailtask',
      }),
      header: {
        'class': [
          ...DialogPreset.header.class,

          // Customs
          '!px-6',
          '!h-12',
          '!gap-0',
          '!border-grayscale-900 !border-b',
        ],
        'data-wv-section': 'detailtask-header',
      },
      content: {
        class: [
          ...DialogPreset.content({ state: {}, instance: {} }).class,

          // Customs
          // '!pl-6 !py-3 !pr-6',
          'detailtask-scrollbar-hide',
        ],
      },
      footer: {
        class: [...DialogPreset.footer.class],
      },
    }"
    @hide="reset"
    @show="handleShow"
    modal
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <span class="text-lg font-semibold leading-4">Detail Task</span>
        <div class="flex items-center gap-1.5">
          <Button
            v-if="!isNewTask"
            @click="toggleCommentSection"
            class="!p-1"
            icon="chat-1-line"
            icon-class="!w-6 !h-6"
            severity="secondary"
            text
          />
          <TaskMore
            v-if="
              !isNewTask &&
              userType !== 'guest' &&
              ['Backlog', 'Sprint', 'Waiting Approval'].includes(
                taskDetail?.status,
              )
            "
            :task-detail="taskDetail"
          />
          <Button
            @click="visible = false"
            class="!p-0.5 !text-general-200 dark:!text-general-200"
            data-wv-section="closebutton"
            icon="close"
            icon-class="w-[22px] h-[22px]"
            severity="secondary"
            text
          />
        </div>
      </div>
    </template>
    <template #default>
      <div class="flex">
        <div
          class="w-[800px] max-h-[600px] flex flex-col gap-3 !px-6 !py-3 overflow-y-auto detailtask-scrollbar-hide"
        >
          <Legend
            :initial-module="props.initialModule"
            :initial-sub-module="props.initialSubModule"
          />
          <TabMenu
            v-model:active-index="taskMenuIndex"
            :menu="taskMenu"
            class="!overflow-visible"
          />
          <component
            :key="taskMenuKey"
            :is="taskMenu[taskMenuIndex].component"
          />
        </div>
        <div
          v-if="showCommentSection"
          class="w-[520px] max-h-[600px] border-l border-grayscale-900 overflow-y-auto detailtask-scrollbar-hide"
        >
          <div
            class="flex items-center justify-between py-4 px-6 border-b border-grayscale-900"
          >
            <span class="text-base font-semibold">Komentar</span>
            <Button
              class="!p-1"
              icon="search"
              icon-class="!w-6 !h-6"
              severity="secondary"
              text
            />
          </div>
          <div class="py-3 px-6">
            <Comment
              :mention-section="
                (cb: MentionSectionFunc) => {
                  if (mentionedSectionText !== undefined) {
                    cb?.(mentionedSectionText);
                  }
                  mentionedSectionText = undefined;
                }
              "
              :object-id="taskDetail?._id"
              :user="{
                _id: user?._id,
                fullName: user?.fullName,
                profilePicture: user?.profilePictureMedium,
              }"
              comment-type="task"
            />
          </div>
        </div>
      </div>
    </template>
  </Dialog>

  <TaskDetail
    v-if="selectedTaskId"
    v-model:visible="dialogDetailTask"
    :initial-module="props.initialModule ?? undefined"
    :initial-sub-module="props.initialSubModule ?? undefined"
    :project-id="projectId"
    :task-id="selectedTaskId"
    @create="emit('create')"
    @delete="emit('delete')"
    @update="emit('update')"
  />
</template>

<style>
/* Hide scrollbar for Chrome, Safari and Opera */
.detailtask-scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.detailtask-scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
