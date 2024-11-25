<script setup lang="ts">
import { useLoadingStore } from 'lib/build-entry';
import DialogConfirm from 'lib/components/dialogconfirm/DialogConfirm.vue';
import TaskServices from 'lib/services/task.service';
import { TaskDetailData } from 'lib/types/task.type';
import { useToast } from 'lib/utils';

const toast = useToast();
const { setLoading } = useLoadingStore();

const props = defineProps<{
  taskDetail: Pick<TaskDetailData, '_id' | 'name'>;
}>();

const emit = defineEmits<{
  saved: [];
}>();

const visible = defineModel<boolean>('visible', { required: true });

const markTaskAsSprint = async (): Promise<void> => {
  try {
    setLoading(true);
    const { data } = await TaskServices.markAsSprint(props.taskDetail._id);
    if (data) {
      toast.add({
        message: 'Task telah diedit.',
        severity: 'success',
      });
      emit('saved');
    }
  } catch (error) {
    toast.add({
      message: 'Task gagal diedit.',
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
    @confirm="markTaskAsSprint"
    confirm-label="Edit"
    header="Edit Task"
    message="Apakah kamu yakin ingin mengedit task ini?"
    severity="success"
  />
</template>
