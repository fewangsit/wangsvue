<script setup lang="ts">
import Button from 'lib/components/button/Button.vue';
import Card from 'lib/components/card/Card.vue';
import DialogForm from 'lib/components/dialogform/DialogForm.vue';
import { FormValue } from 'lib/components/form/Form.vue.d';
import InputText from 'lib/components/inputtext/InputText.vue';
import InputEmail from 'lib/components/inputemail/InputEmail.vue';
import InputNumber from 'lib/components/inputnumber/InputNumber.vue';
import { ref, shallowRef } from 'vue';
import DocTitle from '../DocTitle.vue';

const showForm = shallowRef<boolean>(false);
const formValues = ref<FormValue>();
const showResult = ref<boolean>(false);

const apply = (e: {
  formValues: FormValue;
  stayAfterSubmit: boolean;
}): void => {
  formValues.value = e.formValues;
};
</script>

<template>
  <Card>
    <template #header> <DocTitle name="Dialog Form" /> </template>
    <template #content>
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <Button
            @click="showForm = true"
            icon="eye"
            label="Show Dialog Form"
            severity="success"
          />
          <Button
            :label="
              showResult !== true
                ? 'Click to Show Form Values'
                : 'Click to Hide Form Values'
            "
            @click="showResult = !showResult"
          />
        </div>
        <template v-if="showResult === true && formValues">
          <pre>{{ formValues }}</pre>
        </template>
      </div>
      <DialogForm
        v-model:visible="showForm"
        :buttons-template="['submit', 'cancel', 'clear']"
        :closable="false"
        @submit="apply"
        header="Buat Member"
        show-stay-checkbox
        width="small"
      >
        <template #fields>
          <InputText
            :validator-message="{
              exceed: 'Max char 30',
              empty: 'Should not empty',
            }"
            field-name="username"
            label="Username"
            mandatory
            placeholder="Use custom placholder"
            use-validator
          />
          <InputEmail
            :validator-message="{
              exceed: 'Max char 30',
              empty: 'Should not empty',
              invalidFormat: 'Formatnya salah',
            }"
            field-name="email"
            label="Email"
            mandatory
            placeholder="Masukkan email"
            use-validator
          />
          <InputText
            :validator-message="{
              exceed: 'Max char 30',
              empty: 'Should not empty',
            }"
            field-name="firstname"
            label="Nama Depan"
            mandatory
            use-validator
          />
          <InputText
            :validator-message="{
              exceed: 'Max char 30',
              empty: 'Should not empty',
            }"
            field-name="lastname"
            label="Nama Belakang"
            mandatory
            use-validator
          />
          <InputNumber
            :validator-message="{
              exceed: 'Max char 30',
              empty: 'Should not empty',
            }"
            field-name="phone"
            label="Nomor Telepon"
            mandatory
            use-validator
          />
          <InputText
            disabled
            field-name="nationality"
            label="Kewarganegaraan"
            use-validator
            value="Indonesia"
          />
        </template>

        <template #aside-right />
      </DialogForm>
    </template>
  </Card>
</template>
