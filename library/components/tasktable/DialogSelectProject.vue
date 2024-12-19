<script setup lang="ts">
import DialogForm from 'lib/components/dialogform/DialogForm.vue';
import { ref, shallowRef } from 'vue';
import Dropdown from '../dropdown/Dropdown.vue';
import { DropdownOption } from 'lib/types/options.type';
import { useToast } from 'lib/utils';
import { ProjectServices } from 'wangsit-api-services';
import { FormPayload } from '../form/Form.vue.d';

const toast = useToast();

const visible = defineModel<boolean>('visible', { required: true });

const emit = defineEmits<{
  saved: [projectId: string];
}>();

const isLoadingOptions = shallowRef<boolean>(false);
const projectOptions = ref<DropdownOption[]>();

const getProjectOptions = async (): Promise<void> => {
  try {
    isLoadingOptions.value = true;

    const { data } = await ProjectServices.getProjectList();

    projectOptions.value = data.data?.map(
      (dt): DropdownOption => ({
        label: dt.name,
        value: dt._id,
      }),
    );
  } catch (error) {
    toast.add({
      message: 'Daftar projek gagal dimuat.',
      error,
    });
  } finally {
    isLoadingOptions.value = false;
  }
};

const handleSubmit = (payload: FormPayload): void => {
  const projectId = payload.formValues.project as unknown as string;
  emit('saved', projectId);
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
    data-wv-name="dialog-select-project"
    header="Pilih Proyek"
  >
    <template #fields>
      <Dropdown
        :loading="isLoadingOptions"
        :options="projectOptions"
        @show="getProjectOptions"
        field-name="project"
        label="Proyek"
        mandatory
        option-label="label"
        option-value="value"
        placeholder="Pilih proyek"
        use-validator
        validator-message="Proyek harus dipilih."
      />
    </template>
  </DialogForm>
</template>
