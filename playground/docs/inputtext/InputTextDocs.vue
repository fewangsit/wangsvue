<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import InputText from 'lib/components/inputtext/InputText.vue';
import { computed, shallowRef } from 'vue';
const text = shallowRef('This is an example text that exceeds max length');
const initiallyempty = shallowRef();

const invalidState = computed(() => text.value?.length > 10);
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

        This input will be invalid if the length more than 10 char: invalid
        {{ invalidState }}
        <InputText
          :invalid="invalidState"
          :value="text"
          use-validator
          v-model:="text"
          validator-message="Error Message"
        />
        These input is initially empty
        <InputText
          :validator-message="{ empty: 'validate on blur' }"
          field-name="emptytext"
          mandatory
          use-validator
          validate-on-blur
        />
        <InputText
          v-model="initiallyempty"
          :validator-message="{ empty: 'validate on blur' }"
          field-name="alsoemptytext"
          mandatory
          use-validator
          validate-on-blur
        />
        Disabled and Invalid State
        <InputText
          :invalid="invalidState"
          :value="text"
          disabled
          use-validator
          v-model:="text"
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
          placeholder="Input Text"
        />
      </div>

      Default Placeholder
      <InputText field-info="Mandatory" label="Name" mandatory />
    </template>
  </Card>
</template>
