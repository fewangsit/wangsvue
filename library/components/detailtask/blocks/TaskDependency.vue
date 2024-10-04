<script setup lang="ts">
import Icon from 'lib/components/icon/Icon.vue';
import MultiSelect from 'lib/components/multiselect/MultiSelect.vue';
import eventBus from 'lib/event-bus';
import TaskServices from 'lib/services/task.service';
import { MultiSelectOption } from 'lib/types/options.type';
import { TaskDependency } from 'lib/types/task.type';
import { useToast } from 'lib/utils';
import { inject, Ref, ref } from 'vue';

const toast = useToast();

const props = defineProps<{
  taskDependency: TaskDependency[];
}>();

const taskId = inject<Ref<string>>('taskId');

const taskOptions = ref<MultiSelectOption[]>();
const taskLoading = ref<boolean>(false);

// TODO: Handle task dependency changes.
const handleChange = async (): Promise<void> => {
  try {
    eventBus.emit('detail-task:update', { taskId: taskId.value });
  } catch (error) {
    console.error(error);
    toast.add({
      message: 'Task gagal di-update.',
      severity: 'error',
      error,
    });
  }
};

// TODO: Get task with the appropriate filter.
const getTaskOptions = async (): Promise<void> => {
  try {
    taskLoading.value = true;

    const { data } = await TaskServices.getTaskList();

    taskOptions.value = data.data.data.map((d) => ({
      label: d.name,
      value: d._id,
    }));
  } catch (error) {
    console.error(error);
    toast.add({
      message: 'Data Task gagal diambil.',
    });
  } finally {
    taskLoading.value = false;
  }
};
</script>

<template>
  <div data-wv-section="detailtask-task-dependency">
    <div class="flex items-center gap-2">
      <Icon class="w-6 h-6" icon="link" />
      <div class="text-xs font-semibold">Task Dependensi</div>
    </div>
    <div v-if="props.taskDependency" class="pl-12 flex flex-col gap-2">
      <div :key="index" v-for="(pTask, index) in props.taskDependency">
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold">Proses: </span>
          <span>{{ pTask.process.name }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold">Modul: </span>
          <span>{{ pTask.module.name }}</span>
        </div>
        <div v-if="pTask.subModule" class="flex items-center gap-2">
          <span class="text-xs font-semibold">Sub Modul: </span>
          <span>{{ pTask.subModule.name }}</span>
        </div>
        <MultiSelect
          :initial-value="pTask.task"
          :loading="taskLoading"
          :options="taskOptions"
          @change="handleChange"
          @show="getTaskOptions"
          placeholder="Pilih task"
        />
      </div>
    </div>
  </div>
</template>
