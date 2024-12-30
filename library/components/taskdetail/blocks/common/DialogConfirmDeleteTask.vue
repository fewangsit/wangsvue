<script setup lang="ts">
import DialogConfirm from 'lib/components/dialogconfirm/DialogConfirm.vue';
import { SprintServices, TaskServices } from 'wangsit-api-services';
import { TaskDetailData } from 'lib/types/task.type';
import { useToast } from 'lib/utils';
import { TaskTablePage } from 'lib/components/tasktable/TaskTable.vue.d';

const toast = useToast();

const props = defineProps<{
  tasks: Pick<TaskDetailData, '_id' | 'name'>[];
  page: TaskTablePage;
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
      await TaskServices.deleteTask(props.tasks.map((task) => task._id));
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
