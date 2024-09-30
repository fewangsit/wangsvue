<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import InputNumber from 'lib/components/inputnumber/InputNumber.vue';
import { shallowRef } from 'vue';

const numberinputted = shallowRef(123456789);
const numberinvalid = shallowRef(123456789);
const numberinfo = shallowRef(123456789);
const numberinfomandatory = shallowRef(123456789);
const numberlimit = shallowRef();
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Input Number" />
    </template>
    <template #content>
      <div
        class="flex flex-col gap-3 p-4 relative bg-[#fff] rounded-[5px] border-2 border-dashed border-[#9747ff]"
      >
        Number you have inputted: {{ numberinputted }}
        <InputNumber v-model="numberinputted" />

        Example Invalid State
        <InputNumber
          :value="numberinvalid"
          invalid
          use-validator
          v-model:="numberinvalid"
          validator-message="Error Message"
        />
        Example Disabled and Invalid State
        <InputNumber
          :value="numberinvalid"
          disabled
          invalid
          use-validator
          v-model:="numberinvalid"
          validator-message="Error Message"
        />
        Input Number with field label and info
        <InputNumber
          v-model="numberinfo"
          field-info="Input Number"
          label="Input Number"
        />
        <InputNumber
          v-model="numberinfomandatory"
          field-info="Mandatory"
          label="Input Number"
          mandatory
        />
        Input Number with limitted to 5 digit
        <InputNumber
          v-model="numberlimit"
          :max-digit="5"
          field-info="Input Number"
          label="Input Number"
        />
        Non Empty Input Value fallbacks to zero
        <InputNumber
          :allow-empty-value="false"
          field-info="Input Number"
          label="Input Number"
        />

        Non Empty Input Value fallbacks to min value (2)
        <InputNumber
          :allow-empty-value="false"
          :min="2"
          field-info="Input Number with Min Value 2"
          label="Min 2"
        />
      </div>
    </template>
  </Card>
</template>
