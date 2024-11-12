<script setup lang="ts">
import DialogConfirm from 'lib/components/dialogconfirm/DialogConfirm.vue';
import eventBus from 'lib/event-bus';
import TaskServices from 'lib/services/task.service';
import { TaskDetailData } from 'lib/types/task.type';
import { useToast } from 'lib/utils';

const toast = useToast();

const props = defineProps<{
  taskDetail: Pick<TaskDetailData, '_id' | 'name'>;
}>();

const visible = defineModel<boolean>('visible', { required: true });

const deleteTask = async (): Promise<void> => {
  try {
    const { data } = await TaskServices.deleteTask(props.taskDetail._id);
    if (data) {
      toast.add({
        message: 'Task telah dihapus.',
        severity: 'success',
      });
      eventBus.emit('detail-task:delete', { taskId: props.taskDetail._id });
    }
  } catch (error) {
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
    :list="[props.taskDetail?.name]"
    @confirm="deleteTask"
    confirm-label="Hapus"
    header="Hapus Task"
    message="Apakah kamu yakin ingin menghapusnya?"
    severity="danger"
  />
</template>
