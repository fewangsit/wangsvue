<script setup lang="ts">
import DialogConfirm from 'lib/components/dialogconfirm/DialogConfirm.vue';
import { TaskServices } from 'wangsit-api-services';
import { TaskDetailData } from 'lib/types/task.type';
import { useToast } from 'lib/utils';

const toast = useToast();

const props = defineProps<{
  tasks: Pick<TaskDetailData, '_id' | 'name'>[];
}>();

const emit = defineEmits<{
  saved: [];
}>();

const visible = defineModel<boolean>('visible', { required: true });

const deleteTask = async (): Promise<void> => {
  try {
    const { data } = await TaskServices.deleteTask(
      props.tasks.map((task) => task._id),
    );
    if (data) {
      toast.add({
        message: 'Task telah dihapus.',
        severity: 'success',
      });
      emit('saved');
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
    :list="props.tasks?.map((task) => task?.name)"
    @confirm="deleteTask"
    confirm-label="Hapus"
    header="Hapus Task"
    message="Apakah kamu yakin ingin menghapusnya?"
    severity="danger"
  />
</template>
