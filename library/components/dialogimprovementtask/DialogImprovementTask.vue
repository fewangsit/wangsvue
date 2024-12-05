<!-- eslint-disable no-nested-ternary -->
<script setup lang="ts">
import { useToast } from 'lib/utils';
import { computed, ref, shallowRef } from 'vue';
import {
  DialogImprovementTaskEmits,
  DialogImprovementTaskProps,
} from './DialogImprovementTask.vue.d';
import { TaskChildren, TaskDependencyDetail } from 'lib/types/task.type';
import TaskDependencyServices from 'lib/services/taskDependency.service';
import UserName from 'lib/components/username/UserName.vue';
import MultiSelect from 'lib/components/multiselect/MultiSelect.vue';
import DialogForm from '../dialogform/DialogForm.vue';
import TaskServices from 'lib/services/task.service';
import TaskDetail from '../taskdetail/TaskDetail.vue';
import Animation from '../animation/Animation.vue';
import Icon from '../icon/Icon.vue';
import NotificationServices from 'lib/services/notification.service';

const toast = useToast();

const props = defineProps<DialogImprovementTaskProps>();
const emit = defineEmits<DialogImprovementTaskEmits>();

const visible = defineModel<boolean>('visible', { required: true });
const selectedTaskId = shallowRef<string>();
const dialogDetailTask = shallowRef<boolean>(false);
const loading = shallowRef<boolean>(false);
const invalidForm = shallowRef<boolean>(false);
const validatorMessage = shallowRef<string>();
const taskChildren = ref<TaskChildren[]>();
const children = ref<TaskChildren[]>();

const buttonsTemplate = computed<('submit' | 'cancel')[]>(() => {
  const buttons: ('submit' | 'cancel')[] = ['cancel'];
  if (children.value?.length) buttons.push('submit');
  return buttons;
});

const openDetailTask = (taskIdParam: string): void => {
  selectedTaskId.value = taskIdParam;
  dialogDetailTask.value = true;
};

const loadData = async (): Promise<void> => {
  children.value = [];
  loading.value = true;
  try {
    const { data } = await TaskDependencyServices.getChildrenTasks(
      props.taskId,
    );

    taskChildren.value = data.data.map((child) => {
      return {
        ...child,
        options: child.tasks.map((t) => ({ label: t.name, value: t })),
      };
    });

    children.value = data.data.map((child) => {
      return {
        ...child,
        tasks: undefined,
      };
    });
  } catch (error) {
    console.error(error);
    toast.add({
      message: 'Task dependensi gagal dimuat.',
      error,
    });
  } finally {
    loading.value = false;
  }
};

const markAsImprovement = async (): Promise<void> => {
  try {
    const tasks: TaskDependencyDetail[] = [];
    children.value.forEach((child) => {
      if (child.tasks) tasks.push(...child.tasks);
    });

    const taskIds = tasks.map((task) => task._id);
    if (taskIds.length === 0) {
      invalidForm.value = true;
      validatorMessage.value = 'Tidak ada task yang dipilih.';
      return;
    }
    invalidForm.value = false;
    validatorMessage.value = undefined;

    await TaskServices.markAsImprovement(taskIds);
    await NotificationServices.readNotification(props.notificationId);
    visible.value = false;
    emit('close', props.notificationId);

    toast.add({
      message: 'Berhasil menandai penyesuaian.',
      severity: 'success',
    });
  } catch (error) {
    console.error(error);
    toast.add({
      message: 'Gagal menandai penyesuaian.',
      error,
    });
  }
};
</script>

<template>
  <TaskDetail
    v-model:visible="dialogDetailTask"
    :project-id="projectId"
    :task-id="selectedTaskId"
    @create="loadData"
    @delete="loadData"
    @update="loadData"
  />

  <DialogForm
    v-model:visible="visible"
    :buttons-template="buttonsTemplate"
    :closable="false"
    :close-on-submit="false"
    :invalid="invalidForm"
    :reset-after-submit="false"
    :validator-message="validatorMessage"
    @show="loadData"
    @submit="markAsImprovement"
    class="w-[800px]"
    header="Pilih Task Untuk Penyesuaian"
    width="xlarge"
  >
    <template #fields>
      <div :key="index" v-for="(child, index) in children" class="font-normal">
        <div class="flex gap-2">
          <div class="flex text-xs items-center gap-1">
            <span class="font-semibold">Proses: </span>
            {{ child.process?.name }}
          </div>
          <div class="flex text-xs items-center gap-1">
            <span class="font-semibold">Modul: </span>
            {{ child.module?.name }}
          </div>
          <div v-if="child.subModule" class="flex text-xs items-center gap-1">
            <span class="font-semibold">Sub Modul: </span>
            {{ child.subModule?.name }}
          </div>
          <div class="flex items-center gap-1">
            <span class="text-xs font-semibold">Task: </span>
            <MultiSelect
              v-model="child.tasks"
              :options="taskChildren[index].options"
              class="!w-[110px]"
              option-label="label"
              option-value="value"
              placeholder="Pilih task"
            />
          </div>
        </div>
        <ul class="list-none space-y-2">
          <li
            :key="taskIndex"
            v-for="(task, taskIndex) in child.tasks"
            class="flex first:!pt-1 before:content-['•'] before:mr-2"
          >
            <div class="flex items-center gap-2">
              <span @click="openDetailTask(task._id)" class="cursor-pointer">
                {{ task.name }}
              </span>
              <div v-if="task.assignedTo?.length" class="flex gap-2">
                <UserName
                  :key="userIndex"
                  v-for="(user, userIndex) in task.assignedTo"
                  :user="user"
                  type="icon"
                />
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div
        v-if="loading"
        class="flex pt-4 h-[73px] items-center justify-center"
      >
        <Icon class="text-5xl animate-spin duration-200" icon="spinner" />
      </div>

      <div
        v-else-if="!children?.length"
        class="w-full flex items-center justify-center"
      >
        <Animation animation="no-data" class="w-44 h-auto" />
      </div>
    </template>
  </DialogForm>
</template>
