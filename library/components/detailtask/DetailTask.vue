<script setup lang="ts">
import {
  computed,
  DefineComponent,
  provide,
  ref,
  onMounted,
  onUnmounted,
  watch,
} from 'vue';

import Dialog from 'primevue/dialog';
import DialogPreset from 'lib/preset/dialog';
import Legend, { TaskLegendForm } from './blocks/Legend.vue';
import Button from '../button/Button.vue';
import { DetailTaskEmits, DetailTaskProps } from './DetailTask.vue.d';
import { MenuItem } from '../menuitem';
import TabMenu from '../tabmenu/TabMenu.vue';
import InfoTaskTab from './blocks/Tabs/InfoTaskTab.vue';
import { TaskDetail } from 'lib/types/task.type';
import eventBus from 'lib/event-bus';
import useLoadingStore from '../loading/store/loading.store';
import { useToast } from 'lib/utils';
import TaskServices from 'lib/services/task.service';
import DescriptionTab from './blocks/Tabs/DescriptionTab.vue';
import TaskMore from './blocks/TaskMore.vue';
import ProjectServices from 'lib/services/project.service';
import { ProjectDetail } from 'lib/types/project.type';
import { ProjectProcess } from 'lib/types/projectProcess.type';

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

type SelectedProcess = Pick<
  ProjectProcess,
  '_id' | 'name' | 'team' | 'processPosition'
>;

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
  const { isPM, leaders } = projectDetail.value ?? {};
  const processTeam = selectedProcess.value?.team?.[0]?.initial;
  const isTeamLeader =
    processTeam && leaders?.length && leaders?.includes(processTeam);

  if (isAdmin) {
    return 'admin';
  } else if (isPM) {
    return 'pm';
  } else if (isTeamLeader) {
    return 'teamLeader';
  }
  return 'member';
});

/**
 * To be used for the first initial loading.
 */
const firstFetch = ref<boolean>(true);
const taskId = ref<string>();
const taskDetail = ref<TaskDetail>();
const isNewTask = ref<boolean>(false);
const taskMenuIndex = ref<number>(0);

const projectDetail = ref<ProjectDetail>();
const selectedProcess = ref<SelectedProcess>();

const legendForm = ref<TaskLegendForm>({});

const loadingTask = ref(true);

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
      component: InfoTaskTab,
    },
    {
      label: 'Event Log',
      disabled: isNewTask.value,
      component: InfoTaskTab,
    },
  ];
});

const getProjectDetail = async (): Promise<void> => {
  try {
    const projectId = sessionStorage.getItem('projectId');
    if (projectId) {
      const { data } = await ProjectServices.getProjectDetail(projectId);
      projectDetail.value = data.data;
    }
  } catch (error) {
    toast.add({
      message: 'Gagal memuat proyek detail.',
      severity: 'error',
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
    if (id !== taskId.value) return;

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
};

const handleProcessChange = (process: SelectedProcess): void => {
  selectedProcess.value = process;
};

provide('taskId', taskId);
provide('taskDetail', taskDetail);
provide('isNewTask', isNewTask);
provide('userType', userType);
provide('legendForm', legendForm);
provide('loadingTask', loadingTask);

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

watch(visible, (value) => {
  if (!value) {
    taskId.value = undefined;
    taskDetail.value = undefined;
    selectedProcess.value = undefined;
    legendForm.value = {};
    isNewTask.value = false;
  }
});
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :block-scroll="false"
    :closable="false"
    :draggable="false"
    :pt="{
      root: () => ({
        'class': [
          ...DialogPreset.root({ state: {} }).class,

          //   Customs
          '!w-[clamp(800px,800px,95vw)]',
          '!h-[648px]',
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
          '!p-0 !m-0',
          '!pl-6 !py-3 !pr-3 !mr-3',
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
            class="!p-1"
            icon="chat-1-line"
            icon-class="!w-6 !h-6"
            severity="secondary"
            text
          />
          <TaskMore v-if="!isNewTask" :task-detail="taskDetail" />
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
      <div class="flex flex-col gap-3">
        <pre>{{ userType }}</pre>
        <Legend @process-change="handleProcessChange" />
        <TabMenu v-model:active-index="taskMenuIndex" :menu="taskMenu" />
        <component :is="taskMenu[taskMenuIndex].component" />
      </div>
      <pre>{{ taskDetail }}</pre>
    </template>
  </Dialog>
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
