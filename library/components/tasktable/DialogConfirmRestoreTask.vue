<script setup lang="ts">
import { useLoadingStore } from 'lib/build-entry';
import DialogConfirm from 'lib/components/dialogconfirm/DialogConfirm.vue';
import TaskServices from 'lib/services/task.service';
import { TaskDetailData } from 'lib/types/task.type';
import { useToast } from 'lib/utils';

const toast = useToast();
const { setLoading } = useLoadingStore();

const visible = defineModel<boolean>('visible', { required: true });

const props = defineProps<{
  tasks: Pick<TaskDetailData, '_id' | 'name'>[];
}>();

const emit = defineEmits<{
  saved: [];
}>();

const restoreTasks = async (): Promise<void> => {
  try {
    setLoading(true);
    const ids = props.tasks.map((task) => task._id);
    const { data } = await TaskServices.restoreTasks(ids);
    if (data) {
      toast.add({
        message: 'Task telah dipulihkan.',
        severity: 'success',
      });
      emit('saved');
    }
  } catch (error) {
    toast.add({
      message: 'Task gagal dipulihkan.',
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
    @confirm="restoreTasks"
    confirm-label="Simpan"
    header="Pulihkan Task"
    message="Task ini akan kembali menjadi aktif dan berstatus backlog. Apakah kamu yakin ingin memulihkannya?"
    severity="success"
  />
</template>
