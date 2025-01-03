<script setup lang="ts">
import DialogConfirm from 'lib/components/dialogconfirm/DialogConfirm.vue';
import { SprintServices, TaskServices } from 'wangsit-api-services';
import { TaskDetailData } from 'lib/types/task.type';
import { useToast } from 'lib/utils';
import { TaskTablePage } from 'lib/components/tasktable/TaskTable.vue.d';

const toast = useToast();

const props = defineProps<{
  tasks: Pick<TaskDetailData, '_id' | 'name' | 'process' | 'status'>[];
  page?: TaskTablePage;
  projectId?: string;
  selectedPbiId?: string;
}>();

const emit = defineEmits<{
  saved: [];
}>();

const visible = defineModel<boolean>('visible', { required: true });

const deleteTask = async (): Promise<void> => {
  try {
    if (props.page === 'project-productBacklogItem') {
      await SprintServices.deletePbiTasks(
        props.projectId,
        props.selectedPbiId,
        { taskIds: props.tasks.map((task) => task._id) },
      );
    } else {
      /**
       * Filters the tasks to find those that should be permanently deleted.
       * A task is considered for permanent deletion if (or):
       * - The task's process name is 'Create API'
       * - The task's status is 'Waiting for Approval'
       */
      const deletePermanentTasks = props.tasks.filter(
        (task) =>
          task.process?.name === 'Create API' ||
          task.status === 'Waiting for Approval',
      );

      /**
       * Filters the tasks to find those that should be temporarily deleted.
       * A task is considered for temporary deletion if (and):
       * - The task's process name is not 'Create API'
       * - The task's status is not 'Waiting for Approval'
       */
      const deleteTempTasks = props.tasks.filter(
        (task) =>
          task.process?.name !== 'Create API' &&
          task.status !== 'Waiting for Approval',
      );

      if (deletePermanentTasks.length) {
        await TaskServices.deleteTasksPermanently(
          deletePermanentTasks.map((task) => task._id),
        );
      }
      if (deleteTempTasks.length) {
        await TaskServices.deleteTask(deleteTempTasks.map((task) => task._id));
      }
    }
    toast.add({
      message: 'Task telah dihapus.',
      severity: 'success',
    });
    emit('saved');
  } catch (error) {
    console.error(error);
    toast.add({
      message: 'Task gagal dihapus.',
      error,
    });
  }
};
</script>

<template>
  <DialogConfirm
    v-model:visible="visible"
    :list="props.tasks?.map((task) => task?.name)"
    @confirm="deleteTask"
    confirm-label="Hapus"
    header="Hapus Task"
    message="Apakah kamu yakin ingin menghapusnya?"
    severity="danger"
  />
</template>
