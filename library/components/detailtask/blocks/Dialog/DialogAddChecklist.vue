<script setup lang="ts">
import { inject, Ref, ref } from 'vue';

import DialogForm from 'lib/components/dialogform/DialogForm.vue';
import Dropdown from 'lib/components/dropdown/Dropdown.vue';
import useLoadingStore from 'lib/components/loading/store/loading.store';
import eventBus from 'lib/event-bus';
import { DropdownOption } from 'lib/types/options.type';
import { useToast } from 'lib/utils';
import InputText from 'lib/components/inputtext/InputText.vue';

const { setLoading } = useLoadingStore();
const toast = useToast();

const visible = defineModel<boolean>('visible', { required: true });

const taskId = inject<Ref<string>>('taskId');

const templateOptions = ref<DropdownOption[]>();
const templateLoading = ref<boolean>(false);

// TODO: Get template options.
const getTemplateOptions = async (): Promise<void> => {
  try {
    templateLoading.value = true;
  } catch (error) {
    console.error(error);
    toast.add({
      message: 'Data Template ceklis gagal diambil.',
      severity: 'error',
      error,
    });
  } finally {
    templateLoading.value = false;
  }
};

// TODO: Handle add checklist submit
const handleSubmit = async (): Promise<void> => {
  try {
    setLoading(true);

    eventBus.emit('detail-task:update', { taskId: taskId.value });

    toast.add({
      message: 'Ceklis telah ditambahkan.',
      severity: 'success',
    });
  } catch (error) {
    console.error(error);
    toast.add({
      message: 'Ceklis gagal ditambahkan.',
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
    :buttons-template="['cancel', 'clear', 'submit']"
    :closable="false"
    :show-stay-checkbox="false"
    :use-clear-btn="false"
    @submit="handleSubmit"
    data-wv-name="dialog-add-checklist"
    header="Tambah Ceklis"
  >
    <template #fields>
      <InputText
        :validator-message="{
          empty: 'Nama ceklis harus diisi.',
        }"
        field-name="name"
        label="Nama Ceklis"
        mandatory
        placeholder="Tulis nama ceklis"
        use-validator
      />
      <Dropdown
        :loading="templateLoading"
        :options="templateOptions"
        @show="getTemplateOptions"
        field-name="template"
        label="Salin List Dari"
        option-label="label"
        option-value="value"
        placeholder="Pilih template ceklis"
      />
    </template>
  </DialogForm>
</template>
