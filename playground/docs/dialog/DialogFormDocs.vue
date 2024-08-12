<script setup lang="ts">
import { shallowRef } from 'vue';
import Card from 'wangsvue/card';
import DocTitle from '../DocTitle.vue';
import DialogForm from 'lib/components/dialogform/DialogForm.vue';
import Button from 'lib/components/button/Button.vue';
const showForm = shallowRef<boolean>(false);
</script>

<template>
  <Card>
    <template #header> <DocTitle name="Dialog Form" /> </template>
    <template #content>
      <div class="flex gap-2">
        <Button
          @click="showForm = true"
          icon="eye"
          label="Show Dialog Form"
          severity="success"
        />
      </div>
      <DialogForm
        v-model:visible="showForm"
        :buttons-template="['submit', 'cancel', 'clear']"
        header="Form pembuatan member"
      >
        <template #fields>
          <div class="flex flex-col gap-1 justify-between">
            <label htmlFor="Input">Input</label>
            <input name="Input" />
          </div>
          <div class="flex flex-col gap-1 justify-between">
            <label htmlFor="Input">Input</label>
            <input name="Input" />
          </div>
          <div class="flex flex-col gap-1 justify-between">
            <label htmlFor="Input">Input</label>
            <input name="Input" />
          </div>
        </template>
      </DialogForm>
    </template>
  </Card>
</template>
