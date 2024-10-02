<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, ref, watch } from 'vue';

import Dialog from 'primevue/dialog';
import DialogPreset from 'lib/preset/dialog';
import Legend from './blocks/Legend.vue';
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

const { setLoading } = useLoadingStore();
const toast = useToast();

const visible = defineModel<boolean>('visible', { required: true });

const props = withDefaults(defineProps<DetailTaskProps>(), {
  taskId: undefined,
});

const emit = defineEmits<DetailTaskEmits>();

onMounted(async () => {
  attachEventListener();

  if (props.taskId) {
    taskId.value = props.taskId;
  } else {
    isNewTask.value = true;
  }
});

onUnmounted(() => {
  removeEventListener();
});

/**
 * To be used for the first initial loading.
 */
const firstFetch = ref<boolean>(true);
const taskId = ref<string>();
const taskDetail = ref<TaskDetail>();
const isNewTask = ref<boolean>(false);

const taskMenuIndex = ref<number>(0);
const taskMenu = computed<MenuItem[]>(() => {
  return [
    {
      label: 'Info Task',
      disabled: isNewTask.value,
    },
    {
      label: 'Deskripsi',
      disabled: isNewTask.value,
    },
    {
      label: 'Review',
      disabled: isNewTask.value,
    },
    {
      label: 'Event Log',
      disabled: isNewTask.value,
    },
  ];
});

const getDetailTask = async (): Promise<void> => {
  try {
    if (!taskId.value) return;
    if (firstFetch.value) setLoading(true);

    const { data } = await TaskServices.getTaskDetail(taskId.value);

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

    firstFetch.value = false;
  } catch (error) {
    console.error(error);
    toast.add({
      message: 'Data Task Detail gagal diambil.',
      severity: 'error',
      error,
    });
  } finally {
    setLoading(false);
  }
};

const refreshAndEmitHandler = async (
  eventName: keyof DetailTaskEmits,
  id?: string,
): Promise<void> => {
  try {
    // Skip this function if id doesn't equal the task id.
    if (id !== taskId.value) return;

    await getDetailTask();

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
};

const removeEventListener = (): void => {
  eventBus.off('detail-task:show');
  eventBus.off('detail-task:create');
  eventBus.off('detail-task:update');
};

/**
 * Reset dialog state
 */
const reset = (): void => {
  firstFetch.value = true;
};

provide('taskId', taskId);
provide('taskDetail', taskDetail);
provide('isNewTask', isNewTask);

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
          '!w-[clamp(800px,800px,1200px)]',
          '!h-[648px]',
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
        ],
      },
      footer: {
        class: [...DialogPreset.footer.class],
      },
    }"
    @hide="reset"
    @show="eventBus.emit('detail-task:show', { taskId })"
    modal
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <span class="text-lg font-semibold leading-4">Detail Task</span>
        <div class="flex items-center gap-1.5">
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
      <Legend />
      <TabMenu v-model:active-index="taskMenuIndex" :menu="taskMenu" />
      <div>
        <InfoTaskTab v-if="taskMenuIndex === 0" />
        <DescriptionTab v-if="taskMenuIndex === 1" />
      </div>
    </template>
  </Dialog>
</template>
