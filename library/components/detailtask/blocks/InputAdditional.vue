<script setup lang="ts">
import Button from 'lib/components/button/Button.vue';
import Form from 'lib/components/form/Form.vue';
import { CustomValidation, FormPayload } from 'lib/components/form/Form.vue.d';
import InputText from 'lib/components/inputtext/InputText.vue';

const props = defineProps<{
  value?: string;
  placeholder?: string;
  mandatory?: boolean;
  validatorMessage?: string | CustomValidation;
}>();

const emit = defineEmits<{
  submit: [inputValue: string];
  // eslint-disable-next-line vue/no-unused-emit-declarations
  cancel: [];
}>();

const submitCaption = (e: FormPayload): void => {
  emit('submit', e.formValues?.inputValue as unknown as string);
};
</script>

<template>
  <Form
    :reset-after-submit="false"
    @submit="submitCaption($event)"
    class="!gap-0"
    hide-stay-checkbox
  >
    <template #fields>
      <InputText
        v-focus
        :mandatory="props.mandatory"
        :placeholder="props.placeholder ?? 'Tulis'"
        :validator-message="props.validatorMessage"
        :value="props.value"
        field-name="inputValue"
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
