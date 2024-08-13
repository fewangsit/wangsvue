<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import InputEmail from 'lib/components/inputemail/InputEmail.vue';
import { shallowRef } from 'vue';

const emailinputted = shallowRef();
const emailinvalid = shallowRef('invalid@email');
const emailinfo = shallowRef('email@info.com');
const emailinfomandatory = shallowRef('email@mandatory.info');
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Input Email" />
    </template>
    <template #content>
      <div
        class="flex flex-col gap-3 p-4 relative bg-[#fff] rounded-[5px] border-2 border-dashed border-[#9747ff]"
      >
        Email you have inputted: {{ emailinputted }}
        <InputEmail v-model="emailinputted" />

        Example Invalid State
        <InputEmail
          :value="emailinvalid"
          invalid
          use-validator
          v-model:="emailinvalid"
          validator-message="Error Message"
        />
        Example Disabled and Invalid State
        <InputEmail
          :value="emailinvalid"
          disabled
          invalid
          use-validator
          v-model:="emailinvalid"
          validator-message="Error Message"
        />
        Input Email with field label and info
        <InputEmail
          v-model="emailinfo"
          field-info="Input Email"
          label="Input Email"
        />
        <InputEmail
          v-model="emailinfomandatory"
          field-info="Mandatory"
          label="Input Email"
          mandatory
        />
      </div>
    </template>
  </Card>
</template>
