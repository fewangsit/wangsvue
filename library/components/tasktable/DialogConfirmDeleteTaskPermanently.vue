<script setup lang="ts">
import DialogConfirm from 'lib/components/dialogconfirm/DialogConfirm.vue';
import { TaskDetailData } from 'lib/types/task.type';

const visible = defineModel<boolean>('visible', { required: true });

const props = defineProps<{
  tasks: Pick<TaskDetailData, '_id' | 'name'>[];
}>();
</script>

<template>
  <DialogConfirm
    v-model:visible="visible"
    :list="props.tasks?.map((task) => task?.name)"
    confirm-label="Hapus"
    header="Hapus Permanen"
    message="Jika kamu menghapus data ini, kamu tidak akan dapat memulihkannya. Apakah kamu yakin ingin menghapusnya?"
    severity="danger"
  />
</template>
