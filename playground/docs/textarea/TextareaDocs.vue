<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Textarea from 'lib/components/textarea/Textarea.vue';
import { shallowRef } from 'vue';

const textMaxInput = shallowRef(
  'This is an example text that exceeds max input length',
);
const text = shallowRef();
const textLimited = shallowRef();
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Textarea" />
    </template>
    <template #content>
      <div
        class="flex flex-col gap-3 p-4 relative bg-[#fff] rounded-[5px] border-2 border-dashed border-[#9747ff]"
      >
        This input will be invalid if the length more than 10 char: invalid
        <Textarea
          :max-input="10"
          :validator-message="{ exceed: 'Max 10 char' }"
          :value="textMaxInput"
          disabled
          mandatory
          use-validator
          v-model:="textMaxInput"
        />
        Text you have inputted: {{ text }}
        <Textarea v-model="text" />
        This input will be limited to 4 max character length
        <Textarea v-model="textLimited" :maxlength="4" />
        Textarea with field label and info
        <Textarea v-model="text" field-info="Textarea" label="Textarea" />
        <Textarea
          v-model="text"
          field-info="Mandatory"
          label="Textarea"
          mandatory
          placeholder="Textarea"
        />
      </div>

      Default Placeholder
      <Textarea field-info="Mandatory" label="Name" mandatory />
    </template>
  </Card>
</template>
