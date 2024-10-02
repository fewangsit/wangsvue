<script setup lang="ts">
import DialogForm from 'lib/components/dialogform/DialogForm.vue';
import Dropdown from 'lib/components/dropdown/Dropdown.vue';
import useLoadingStore from 'lib/components/loading/store/loading.store';
import eventBus from 'lib/event-bus';
import { useToast } from 'lib/utils';
import { inject, Ref } from 'vue';

const { setLoading } = useLoadingStore();
const toast = useToast();

const taskId = inject<Ref<string>>('taskId');

const visible = defineModel<boolean>('visible', { required: true });

// TODO: Handle custom dependency submit
const handleSubmit = async (): Promise<void> => {
  try {
    setLoading(true);

    eventBus.emit('detail-task:update', { taskId: taskId.value });

    toast.add({
      message: 'Alur Dependensi telah disimpan.',
      severity: 'success',
    });
  } catch (error) {
    console.error(error);
    toast.add({
      message: 'Alur Dependensi gagal disimpan.',
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
    data-wv-name="dialog-custom-dependency"
    header="Custom Dependensi"
  >
    <template #fields>
      <Dropdown
        :options="[
          {
            label: 'Satu Arah',
            value: 'Satu Arah',
          },
          {
            label: 'Dua Arah',
            value: 'Dua Arah',
          },
        ]"
        label="Pilih Alur Dependensi"
        mandatory
        option-label="label"
        option-value="value"
        placeholder="Pilih alur dependensi"
        use-validator
        validator-message="Alur Dependensi harus dipilih."
      />
    </template>
  </DialogForm>
</template>
