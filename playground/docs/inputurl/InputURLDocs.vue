<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import InputURL from 'lib/components/inputurl/InputURL.vue';
import { computed, shallowRef } from 'vue';
const text = shallowRef(
  'This is an invalid RL, try to input a valid URL to remove hide the error message',
);

const invalidState = computed(() => text.value?.length > 10);
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Input URL" />
    </template>
    <template #content>
      <div
        class="flex flex-col gap-3 p-4 relative bg-[#fff] rounded-[5px] border-2 border-dashed border-[#9747ff]"
      >
        Prefix
        <InputURL v-model="text">
          <template #addon-left>GET</template>
        </InputURL>

        <InputURL v-model="text">
          <template #addon-right>TEG</template>
        </InputURL>
        Text you have inputted: {{ text }}
        <InputURL v-model="text" disabled />

        This input will be invalid if the length more than 10 char: invalid
        {{ invalidState }}
        <InputURL
          :invalid="invalidState"
          :value="text"
          use-validator
          v-model:="text"
          validator-message="Error Message"
        />
        Disabled and Invalid State
        <InputURL
          :invalid="invalidState"
          :value="text"
          disabled
          use-validator
          v-model:="text"
          validator-message="Error Message"
        />
        <InputURL v-model="text" disabled />
        Input Text with field label and info
        <InputURL v-model="text" field-info="Input Text" label="Input Text" />
        <InputURL
          v-model="text"
          field-info="Mandatory"
          label="Input Text"
          mandatory
          placeholder="Input Text"
        />
      </div>

      Default Placeholder
      <InputURL field-info="Mandatory" label="Name" mandatory />
    </template>
  </Card>
</template>
