<script setup lang="ts">
import Button from 'lib/components/button/Button.vue';
import Form from 'lib/components/form/Form.vue';
import { FormPayload } from 'lib/components/form/Form.vue.d';
import InputText from 'lib/components/inputtext/InputText.vue';

const props = defineProps<{
  value?: string;
}>();

const emit = defineEmits<{
  submit: [caption: string];
  cancel: [];
}>();

const submitCaption = (e: FormPayload): void => {
  emit('submit', e.formValues?.caption as unknown as string);
};
</script>

<template>
  <Form
    :reset-after-submit="false"
    @submit="submitCaption($event)"
    hide-stay-checkbox
  >
    <template #fields>
      <InputText
        v-focus
        :value="props.value"
        field-name="caption"
        placeholder="Tulis caption"
        use-validator
      />
      <div class="-mt-1 flex gap-2">
        <Button label="Simpan" severity="success" type="submit" />
        <Button
          @click="emit('cancel')"
          label="Batal"
          severity="secondary"
          text
          type="button"
        />
      </div>
    </template>
  </Form>
</template>
