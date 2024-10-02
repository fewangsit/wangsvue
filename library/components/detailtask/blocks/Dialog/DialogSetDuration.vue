<script setup lang="ts">
import DialogForm from 'lib/components/dialogform/DialogForm.vue';
import InputNumber from 'lib/components/inputnumber/InputNumber.vue';
import useLoadingStore from 'lib/components/loading/store/loading.store';
import eventBus from 'lib/event-bus';
import { useToast } from 'lib/utils';
import { inject, Ref } from 'vue';

const { setLoading } = useLoadingStore();
const toast = useToast();

const taskId = inject<Ref<string>>('taskId');

const visible = defineModel<boolean>('visible', { required: true });

// TODO: Handle assign member submit
const handleSubmit = async (): Promise<void> => {
  try {
    setLoading(true);

    eventBus.emit('detail-task:update', { taskId: taskId.value });

    toast.add({
      message: 'Durasi telah disimpan.',
      severity: 'success',
    });
  } catch (error) {
    console.error(error);
    toast.add({
      message: 'Durasi gagal disimpan.',
      severity: 'error',
      error,
    });
  } finally {
    setLoading(false);
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
