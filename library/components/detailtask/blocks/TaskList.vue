<script setup lang="ts">
import Icon from 'lib/components/icon/Icon.vue';
import LegendList from './LegendList.vue';
import TaskDependencyServices from 'lib/services/taskDependency.service';
import { computed, inject, ref, Ref, watch } from 'vue';
import { TaskLegend } from './Legend.vue';
import TaskServices from 'lib/services/task.service';
import { TaskDetail } from 'lib/types/task.type';
import { useToast } from 'lib/utils';

const toast = useToast();

const props = defineProps<{
  child?: boolean;
}>();

const taskId = inject<Ref<string>>('taskId');
const taskDetail = inject<Ref<TaskDetail>>('taskDetail');

const tasks = ref<TaskLegend[]>();

const taskProcess = computed(() => taskDetail.value?.process ?? undefined);

const getChildTasks = async (): Promise<void> => {
  if (!taskId.value) return;
  try {
    const { data } = await TaskDependencyServices.getChildTasks(taskId.value);
    if (data) {
      tasks.value = data.data;
    }
  } catch (error) {
    toast.add({
      message: 'Child task gagal dimuat.',
      error,
    });
  }
};

const getSimilarTasks = async (): Promise<void> => {
  if (!taskDetail.value) return;
  try {
    const params = {
      project: taskDetail.value.project
        ? JSON.stringify([taskDetail.value.project?._id])
        : undefined,
      process: taskDetail.value.process
        ? JSON.stringify([taskDetail.value.process?._id])
        : undefined,
      module: taskDetail.value.module
        ? JSON.stringify([taskDetail.value.module?._id])
        : undefined,
      subModule: taskDetail.value.subModule
        ? JSON.stringify([taskDetail.value.subModule?._id])
        : undefined,
    };
    const { data: response } = await TaskServices.getTaskList(params);

    if (response) {
      tasks.value = response.data.data.filter(
        (task) => task._id !== taskId.value,
      );
    }
  } catch (error) {
    toast.add({
      message: 'Daftar task gagal dimuat.',
      error,
    });
  }
};

watch(
  taskId,
  async (val) => {
    if (val) {
      if (props.child) {
        await getChildTasks();
      }
    }
  },
  { immediate: true },
);

watch(
  taskProcess,
  async (val) => {
    if (val) {
      if (!props.child) {
        await getSimilarTasks();
      }
    }
  },
  { immediate: true },
);
</script>

<template>
  <div data-wv-section="detailtask-task-list">
    <div class="flex items-center gap-2">
      <Icon
        :icon="props.child ? 'file-copy-2-line' : 'list-ordered'"
        class="w-6 h-6"
      />
      <div class="text-xs font-semibold">
        {{ props.child ? 'Child' : 'Daftar' }} Task
      </div>
    </div>
    <ul v-if="tasks?.length" class="pl-12 list-disc pt-2">
      <li
        :key="index"
        v-for="(task, index) in tasks"
        class="pt-1 pb-1 first:!pt-0 first:!pb-1 last:!pt-1 last:!pb-0"
      >
        <LegendList :legend="task" :priority-value="task.priority" />
      </li>
    </ul>
  </div>
</template>
