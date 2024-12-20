<script setup lang="ts">
import { useLoadingStore } from 'lib/build-entry';
import DialogConfirm from 'lib/components/dialogconfirm/DialogConfirm.vue';
import { TaskServices } from 'wangsit-api-services';
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

const deleteTasksPermanently = async (): Promise<void> => {
  try {
    setLoading(true);
    const ids = props.tasks.map((task) => task._id);
    const { data } = await TaskServices.deleteTasksPermanently(ids);
    if (data) {
      toast.add({
        message: 'Task telah dihapus permanen.',
        severity: 'success',
      });
      emit('saved');
    }
  } catch (error) {
    toast.add({
      message: 'Task gagal dihapus permanen.',
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
    :list="props.tasks?.map((task) => task?.name)"
    @confirm="deleteTasksPermanently"
    confirm-label="Hapus"
    header="Hapus Permanen"
    message="Jika kamu menghapus data ini, kamu tidak akan dapat memulihkannya. Apakah kamu yakin ingin menghapusnya?"
    severity="danger"
  />
</template>
