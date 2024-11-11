<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Card from 'lib/components/card/Card.vue';
import Form from 'lib/components/form/Form.vue';
import InputBadge from 'lib/components/inputbadge/InputBadge.vue';
import DocTitle from '../DocTitle.vue';

const initialValue = ref<string[]>();
const existingValues = ref<string[]>(['abc', 'def', 'krah']);

const setInitialValue = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      initialValue.value = ['Model 1'];
      resolve();
    }, 1000);
  });
};

onMounted(() => setInitialValue());
</script>
<template>
  <Card>
    <template #title>
      <DocTitle name="Input Badge" />
    </template>
    <template #content>
      <Form
        :buttons-template="['submit', 'clear', 'cancel']"
        @save="console.log($event)"
        @submit="console.log($event)"
      >
        <template #fields>
          <InputBadge
            :existing-values="existingValues"
            :initial-value="initialValue"
            :validator-message="{ exist: 'ada' }"
            field-info="Input badge info"
            field-name="models"
            label="Input badge label"
            mandatory
            use-validator
          />
          <InputBadge
            :existing-values="['ada@mailnesia.com']"
            :validator-message="{ exist: 'ADA' }"
            field-info="Input badge info"
            field-name="emails"
            label="Input badge email"
            mandatory
            type="email"
            use-validator
          />
        </template>
      </Form>
    </template>
  </Card>
</template>
