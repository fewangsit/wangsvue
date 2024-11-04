<script setup lang="ts">
import DialogForm from 'lib/components/dialogform/DialogForm.vue';
import Dropdown from 'lib/components/dropdown/Dropdown.vue';
import { FormPayload } from 'lib/components/form/Form.vue.d';

const visible = defineModel<boolean>('visible', { required: true });

const emit = defineEmits<{
  submit: [type: string];
}>();

const submitCustomDependency = (e: FormPayload): void => {
  emit('submit', e.formValues?.dependencyType as unknown as string);
};
</script>

<template>
  <DialogForm
    v-model:visible="visible"
    :buttons-template="['cancel', 'submit']"
    :closable="false"
    :show-stay-checkbox="false"
    :use-clear-btn="false"
    @submit="submitCustomDependency"
    data-wv-name="dialog-custom-dependency"
    header="Custom Dependensi"
  >
    <template #fields>
      <Dropdown
        :options="[
          {
            label: 'Satu Arah',
            value: 'one-way',
          },
          {
            label: 'Dua Arah',
            value: 'two-way',
          },
        ]"
        field-name="dependencyType"
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
