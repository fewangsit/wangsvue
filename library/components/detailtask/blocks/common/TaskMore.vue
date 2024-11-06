<script setup lang="ts">
import { ref } from 'vue';
import Button from 'lib/components/button/Button.vue';
import DialogConfirm from 'lib/components/dialogconfirm/DialogConfirm.vue';
import Menu from 'lib/components/menu/Menu.vue';
import { MenuItem } from 'lib/components/menuitem';
import TaskServices from 'lib/services/task.service';
import { TaskDetail } from 'lib/types/task.type';
import { useToast } from 'lib/utils';
import eventBus from 'lib/event-bus';

const toast = useToast();

const props = defineProps<{
  taskDetail: TaskDetail;
}>();

const moreMenu = ref();
const deleteConfirm = ref<boolean>(false);

const moreModel: MenuItem[] = [
  {
    label: 'Hapus',
    icon: 'delete-bin',
    danger: true,
    command: (): void => {
      deleteConfirm.value = true;
    },
  },
];

const toggleMenu = (e: Event): void => {
  moreMenu.value.toggle(e);
};

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
  <div data-wv-name="task-more">
    <Menu ref="moreMenu" :model="moreModel" />
    <Button
      @click="toggleMenu"
      class="!p-1"
      icon="more"
      icon-class="!w-6 !h-6 rotate-90"
      severity="secondary"
      text
    />
  </div>

  <DialogConfirm
    v-model:visible="deleteConfirm"
    :list="[props.taskDetail?.name]"
    @confirm="deleteTask"
    confirm-label="Hapus"
    header="Hapus Task"
    message="Apakah kamu yakin ingin menghapusnya?"
    severity="danger"
  />
</template>
