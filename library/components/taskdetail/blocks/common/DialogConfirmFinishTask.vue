<script setup lang="ts">
import { useLoadingStore } from 'lib/build-entry';
import DialogConfirm from 'lib/components/dialogconfirm/DialogConfirm.vue';
import eventBus from 'lib/event-bus';
import TaskServices from 'lib/services/task.service';
import { TaskDetailData } from 'lib/types/task.type';
import { useToast } from 'lib/utils';

const toast = useToast();
const { setLoading } = useLoadingStore();

const props = defineProps<{
  taskDetail: Pick<TaskDetailData, '_id' | 'name'>;
}>();

const visible = defineModel<boolean>('visible', { required: true });

const markAsDone = async (): Promise<void> => {
  try {
    setLoading(true);
    const { data } = await TaskServices.markTaskAsDone(props.taskDetail._id);
    if (data) {
      toast.add({
        message: 'Task telah ditandai selesai.',
        severity: 'success',
      });
      eventBus.emit('detail-task:update', { taskId: props.taskDetail._id });
    }
  } catch (error) {
    toast.add({
      message: 'Task gagal ditandai selesai.',
      error,
    });
  } finally {
    setLoading(false);
  }
};
</script>

<template>
  <DialogConfirm
    v-model:visible="visible"
    :list="[props.taskDetail?.name]"
    @confirm="markAsDone"
    confirm-label="Tandai Selesai"
    header="Tandai Selesai Task"
    message="Apakah kamu yakin ingin menandai selesai task ini?"
    severity="success"
  />
</template>
