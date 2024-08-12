<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Form from 'lib/components/form/Form.vue';

const clear = (): void => alert('Field Dibersihkan!');
const apply = (): void => alert('Filter Diterapkan!');
</script>
<template>
  <Card>
    <template #header>
      <DocTitle name="Form" />
    </template>
    <template #subtitle>Auto placement grid system</template>
    <template #content>
      <template :key="index" v-for="(_, index) of Array.from({ length: 8 })">
        <span class="text-base font-medium text-grayscale-900">
          {{ index + 1 }} Field Layout
        </span>

        <Form
          :buttons-template="['cancel', 'clear', 'submit']"
          :column-per-row="index + 1"
          @apply="apply"
          @clear="clear"
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
        </Form>
      </template>
    </template>
  </Card>
</template>
