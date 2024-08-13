<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import InputPassword from 'lib/components/inputpassword/InputPassword.vue';
import { shallowRef } from 'vue';

const passwordinputted = shallowRef();
const passwordinvalid = shallowRef('invalid@password');
const passwordinfo = shallowRef('password@info.com');
const passwordinfomandatory = shallowRef('password@mandatory.info');
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Input Password" />
    </template>
    <template #content>
      <div
        class="flex flex-col gap-3 p-4 relative bg-[#fff] rounded-[5px] border-2 border-dashed border-[#9747ff]"
      >
        Password you have inputted: {{ passwordinputted }}
        <InputPassword v-model="passwordinputted" />

        Example Invalid State
        <InputPassword
          :value="passwordinvalid"
          invalid
          use-validator
          v-model:="passwordinvalid"
          validator-message="Error Message"
        />
        Example Disabled and Invalid State
        <InputPassword
          :value="passwordinvalid"
          disabled
          invalid
          use-validator
          v-model:="passwordinvalid"
          validator-message="Error Message"
        />
        Input Password with field label and info
        <InputPassword
          v-model="passwordinfo"
          field-info="Input Password"
          label="Input Password"
        />
        <InputPassword
          v-model="passwordinfomandatory"
          field-info="Mandatory"
          label="Input Password"
          mandatory
        />
      </div>
    </template>
  </Card>
</template>
