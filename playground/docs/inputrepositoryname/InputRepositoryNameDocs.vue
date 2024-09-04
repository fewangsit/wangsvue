<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import InputRepositoryName from 'lib/components/inputrepositoryname/InputRepositoryName.vue';
import { shallowRef } from 'vue';

const nameinputted = shallowRef();
const nameinfo = shallowRef('name-info');
const nameinfomandatory = shallowRef('name-mandatory-info');
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Input Repository Name" />
    </template>
    <template #content>
      <div
        class="flex flex-col gap-3 p-4 relative bg-[#fff] rounded-[5px] border-2 border-dashed border-[#9747ff]"
      >
        Repository Name you have inputted: {{ nameinputted }}
        <InputRepositoryName
          v-model="nameinputted"
          @update:model-value="console.log($event)"
        />
        Input Repository Name with field label and info
        <InputRepositoryName
          v-model="nameinfo"
          disabled
          field-info="Input Name"
          label="Input Name"
        />
        <InputRepositoryName
          v-model="nameinfomandatory"
          field-info="Mandatory"
          label="Input Name"
          mandatory
          use-validator
        />
      </div>
    </template>
  </Card>
</template>
