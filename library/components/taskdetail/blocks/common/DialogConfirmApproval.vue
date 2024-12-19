<script setup lang="ts">
import { useLoadingStore } from 'lib/build-entry';
import DialogConfirm from 'lib/components/dialogconfirm/DialogConfirm.vue';
import { ApprovalServices } from 'wangsit-api-services';
import { WangsitStatus } from 'lib/types/wangsStatus.type';
import { useToast } from 'lib/utils';
import { computed } from 'vue';

const toast = useToast();
const { setLoading } = useLoadingStore();

const props = defineProps<{
  approvalId: string;
  status?: WangsitStatus;
  isApproved: boolean;
}>();

const emit = defineEmits<{
  saved: [];
}>();

const visible = defineModel<boolean>('visible', { required: true });

const confirmHeader = computed(() =>
  props.isApproved ? 'Terima Approval' : 'Tolak Approval',
);

const confirmMessage = computed(() => {
  if (props.status === 'Waiting for Approval') {
    return props.isApproved
      ? 'Approval akan dikirim. Apakah kamu yakin ingin menerimanya?'
      : 'Task yang ditolak akan dihapus dari list task backlog. Apakah kamu yakin ingin menolaknya?';
  }
  return props.isApproved
    ? 'Approval akan dikirim. Apakah kamu yakin ingin menerimanya?'
    : 'Approval akan dikirim. Apakah kamu yakin ingin menolaknya?';
});

const confirmLabel = computed(() => (props.isApproved ? 'Terima' : 'Tolak'));

const doApproval = async (): Promise<void> => {
  const approvalState = props.isApproved ? 'diterima' : 'ditolak';
  try {
    setLoading(true);
    const { data } = await ApprovalServices.putDoApprovalProcess(
      props.approvalId,
      { isApproved: props.isApproved },
    );
    if (data) {
      toast.add({
        message: `Approval telah ${approvalState}.`,
        severity: 'success',
      });
      emit('saved');
    }
  } catch (error) {
    toast.add({
      message: `Approval gagal ${approvalState}.`,
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
    :confirm-label="confirmLabel"
    :header="confirmHeader"
    :message="confirmMessage"
    :severity="props.isApproved ? 'success' : 'danger'"
    @confirm="doApproval"
  />
</template>
