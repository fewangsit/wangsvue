<script setup lang="ts">
import { useToast } from 'lib/utils';
import { Sprint } from './DetailSprint.vue.d';
import DialogConfirm from '../dialogconfirm/DialogConfirm.vue';
import { ApprovalServices } from 'wangsit-api-services';

const toast = useToast();

const props = defineProps<{
  sprint?: Sprint;
}>();

const emit = defineEmits<{
  createApproval: [void];
}>();

const projectId = sessionStorage.getItem('projectId') as string;

const visible = defineModel<boolean>('visible', { required: true });

const createApproval = async (): Promise<void> => {
  try {
    await ApprovalServices.createApproval(projectId, props.sprint?._id);

    toast.add({
      message: 'Sprint telah dikirim.',
      severity: 'success',
    });
    emit('createApproval');
  } catch (error) {
    toast.add({
      error,
      message: 'Sprint gagal dikirim.',
    });
    console.error(error);
  }
};
</script>

<template>
  <DialogConfirm
    v-model:visible="visible"
    @confirm="createApproval"
    confirm-label="Kirim"
    header="Kirim Ke Approver"
    message="Semua data sprint akan dikirim ke Approver untuk di review. Apakah kamu yakin ingin mengirimnya?"
    severity="success"
  />
</template>
