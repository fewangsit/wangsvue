<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import InputText from 'lib/components/inputtext/InputText.vue';
import { shallowRef } from 'vue';
const text = shallowRef('This is an example text that exceeds maxLength');
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Input Text" />
    </template>
    <template #content>
      <div
        class="flex flex-col gap-3 p-4 relative bg-[#fff] rounded-[5px] border-2 border-dashed border-[#9747ff]"
      >
        Text you have inputted: {{ text }}
        <InputText v-model="text" disabled />

        <InputText
          :invalid="text.length > 10"
          :value="text"
          use-validator
          validator-message="Error Message"
        />
        <InputText v-model="text" disabled />
        Input Text with field label and info
        <InputText v-model="text" field-info="Input Text" label="Input Text" />
        <InputText
          v-model="text"
          field-info="Mandatory"
          label="Input Text"
          mandatory
        />
      </div>
    </template>
  </Card>
</template>
