<script setup lang="ts">
import DialogForm from 'lib/components/dialogform/DialogForm.vue';
import { DialogFormPayload } from 'lib/components/dialogform/DialogForm.vue.d';
import InputNumber from 'lib/components/inputnumber/InputNumber.vue';
import useLoadingStore from 'lib/components/loading/store/loading.store';
import { TaskServices } from 'wangsit-api-services';
import { TaskDetailData } from 'lib/types/task.type';
import { useToast } from 'lib/utils';
import { computed, inject, Ref } from 'vue';
import { DetailTaskEmits } from '../../TaskDetail.vue.d';

const { setLoading } = useLoadingStore();
const toast = useToast();

const taskId = inject<Ref<string>>('taskId');
const taskDetail = inject<Ref<TaskDetailData>>('taskDetail');
const refreshTaskHandler =
  inject<(eventName: keyof DetailTaskEmits, id?: string) => Promise<void>>(
    'refreshTaskHandler',
  );

const visible = defineModel<boolean>('visible', { required: true });

const duration = computed(() => taskDetail.value?.duration ?? undefined); // 'duration' field is in minutes)

const handleSubmit = async (payload: DialogFormPayload): Promise<void> => {
  try {
    setLoading(true);

    /*
     * Extracts day, hour, and minute values from the payload's formValues.
     * Calculates the total duration in minutes by converting days to minutes (day * 60 * 9),
     * hours to minutes (hour * 60), and adding the minutes.
     *
     * Explanation: 1 day = 9 hours
     */
    const { day, hour, minute } = payload.formValues;

    const durationMinutes: number =
      (minute as number) + (hour as number) * 60 + (day as number) * 60 * 9;

    const { data } = await TaskServices.putEditTask(taskId.value, {
      duration: durationMinutes,
    });
    if (data) {
      refreshTaskHandler('update', taskId.value);
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

/**
 * Calculates the duration in days, hours, or minutes based on the given type.
 *
 * The function takes a type parameter which can be 'day', 'hour', or 'minute'.
 * It then calculates the duration based on the value of `duration.value`:
 * - 'day': Returns the number of days by dividing the total minutes by 540 (minutes in a 9-hour day) and flooring the result.
 * - 'hour': Returns the number of hours by taking the remainder of total minutes divided by 540, then dividing by 60 (minutes in an hour) and flooring the result.
 * - 'minute': Returns the remaining minutes by taking the remainder of total minutes divided by 60.
 *
 * If `duration.value` is not a number, the function returns 0.
 *
 * @param {('day' | 'hour' | 'minute')} type - The type of duration to calculate.
 * @returns {number} - The calculated duration in the specified type.
 */
const getDuration = (type: 'day' | 'hour' | 'minute'): number => {
  if (typeof duration.value !== 'number') return 0;

  const totalMinutesInDay = 9 * 60;
  switch (type) {
    case 'day':
      return Math.floor(duration.value / totalMinutesInDay);
    case 'hour':
      return Math.floor((duration.value % totalMinutesInDay) / 60);
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
          :max="8"
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
