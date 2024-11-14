<script setup lang="ts">
import { computed, inject, ref, Ref } from 'vue';
import Button from 'lib/components/button/Button.vue';
import Dialog from 'lib/components/dialog/Dialog.vue';
import { useToast } from 'lib/utils';
import TaskServices from 'lib/services/task.service';
import Icon from 'lib/components/icon/Icon.vue';
import { useLoadingStore } from 'lib/build-entry';

const toast = useToast();
const { setLoading } = useLoadingStore();

const DialogConfirmPreset = inject<Record<string, any>>(
  'preset',
  {},
).dialogconfirm;

const visible = defineModel<boolean>('visible', { required: true });

const props = defineProps<{
  taskIdProp?: string;
}>();

const emit = defineEmits<{
  saved: [];
}>();

const taskIdInject = inject<Ref<string>>('taskId');

const dialogReportBug = ref(false);

const taskId = computed(() =>
  taskIdInject ? taskIdInject.value : props.taskIdProp,
);

const markReviewTaskAsDone = async (): Promise<void> => {
  try {
    setLoading(true);
    const { data } = await TaskServices.reviewTask(taskId.value, []);
    if (data) {
      toast.add({
        message: 'Task telah ditandai selesai review.',
        severity: 'success',
      });
      emit('saved');
      visible.value = false;
    }
  } catch (error) {
    toast.add({
      message: 'Task gagal ditandai selesai review.',
      error,
    });
  } finally {
    setLoading(false);
  }
};

const reportBugTask = async (): Promise<void> => {
  try {
    setLoading(true);
    const { data } = await TaskServices.reportBugTask(taskId.value, {
      note: '',
    });
    if (data) {
      toast.add({
        message: 'Task telah ditandai selesai review.',
        severity: 'success',
      });
      emit('saved');
      visible.value = false;
    }
  } catch (error) {
    toast.add({
      message: 'Task gagal ditandai selesai review.',
      error,
    });
  } finally {
    setLoading(false);
  }
};

const openReportBugDialog = (): void => {
  dialogReportBug.value = true;
  visible.value = false;
};
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :closable="false"
    class="w-[400px]"
    header="Review Leader"
    modal
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <div class="flex gap-2 items-center">
          <Icon
            v-bind="DialogConfirmPreset?.headericon"
            icon="checkbox-circle"
            severity="success"
          />
          <span class="text-lg font-semibold leading-4 text-success-700">
            Selesai Review
          </span>
        </div>
        <Button
          @click="visible = false"
          class="!p-0.5 !text-general-200 dark:!text-general-200"
          data-wv-section="closebutton"
          icon="close"
          icon-class="w-[22px] h-[22px]"
          severity="secondary"
          text
        />
      </div>
    </template>
    <p>Task akan ditandai selesai, pastikan task telah dicek dengan teliti.</p>
    <template #footer>
      <Button
        @click="openReportBugDialog"
        label="Report Bug"
        severity="secondary"
        text
      />
      <Button
        v-focus
        @click="markReviewTaskAsDone"
        label="Tandai Selesai"
        severity="success"
      />
    </template>
  </Dialog>

  <Dialog
    v-model:visible="dialogReportBug"
    :closable="false"
    class="w-[400px]"
    header="Review Leader"
    modal
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <div class="flex gap-2 items-center">
          <Icon
            v-bind="DialogConfirmPreset?.headericon"
            icon="checkbox-circle"
            severity="success"
          />
          <span class="text-lg font-semibold leading-4 text-success-700">
            Report BUG
          </span>
        </div>
        <Button
          @click="dialogReportBug = false"
          class="!p-0.5 !text-general-200 dark:!text-general-200"
          data-wv-section="closebutton"
          icon="close"
          icon-class="w-[22px] h-[22px]"
          severity="secondary"
          text
        />
      </div>
    </template>
    <p>Report Task Will Be Here.</p>
  </Dialog>
</template>
