<script setup lang="ts">
import DialogForm from 'lib/components/dialogform/DialogForm.vue';
import { DialogFormPayload } from 'lib/components/dialogform/DialogForm.vue.d';
import InputNumber from 'lib/components/inputnumber/InputNumber.vue';
import useLoadingStore from 'lib/components/loading/store/loading.store';
import eventBus from 'lib/event-bus';
import TaskServices from 'lib/services/task.service';
import { TaskDetail } from 'lib/types/task.type';
import { useToast } from 'lib/utils';
import { computed, inject, Ref } from 'vue';

const { setLoading } = useLoadingStore();
const toast = useToast();

const taskId = inject<Ref<string>>('taskId');
const taskDetail = inject<Ref<TaskDetail>>('taskDetail');

const visible = defineModel<boolean>('visible', { required: true });

const duration = computed(() => taskDetail.value?.duration ?? undefined); // 'duration' field is in minutes)

const handleSubmit = async (payload: DialogFormPayload): Promise<void> => {
  try {
    setLoading(true);

    const { day, hour, minute } = payload.formValues;

    const durationMinutes: number =
      (minute as number) + (hour as number) * 60 + (day as number) * 60 * 24;

    const { data } = await TaskServices.putEditTask(taskId.value, {
      duration: durationMinutes,
    });
    if (data) {
      eventBus.emit('detail-task:update', { taskId: taskId.value });
      toast.add({
        message: 'Durasi telah disimpan.',
        severity: 'success',
      });
    }
  } catch (error) {
    toast.add({
      message: 'Durasi gagal disimpan.',
      error,
    });
  } finally {
    setLoading(false);
  }
};

const getDuration = (type: 'day' | 'hour' | 'minute'): number => {
  if (typeof duration.value !== 'number') return 0;
  switch (type) {
    case 'day':
      return Math.floor(duration.value / 1440);
    case 'hour':
      return Math.floor((duration.value % 1440) / 60);
    case 'minute':
      return duration.value % 60;
  }
};
</script>

<template>
  <DialogForm
    v-model:visible="visible"
    :buttons-template="['cancel', 'submit']"
    :closable="false"
    :show-stay-checkbox="false"
    :use-clear-btn="false"
    @submit="handleSubmit"
    data-wv-name="dialog-set-duration"
    header="Durasi Task"
  >
    <template #fields>
      <div class="grid grid-cols-3 items-start gap-3">
        <InputNumber
          :min="0"
          :validator-message="{
            empty: 'Hari harus diisi.',
          }"
          :value="getDuration('day')"
          field-name="day"
          label="Hari"
          mandatory
          placeholder="00"
          use-validator
        />
        <InputNumber
          :max="24"
          :min="0"
          :validator-message="{
            empty: 'Jam harus diisi.',
          }"
          :value="getDuration('hour')"
          field-name="hour"
          label="Jam"
          mandatory
          placeholder="00"
          use-validator
        />
        <InputNumber
          :max="60"
          :min="0"
          :validator-message="{
            empty: 'Menit harus diisi.',
          }"
          :value="getDuration('minute')"
          field-name="minute"
          label="Menit"
          mandatory
          placeholder="00"
          use-validator
        />
      </div>
    </template>
  </DialogForm>
</template>
