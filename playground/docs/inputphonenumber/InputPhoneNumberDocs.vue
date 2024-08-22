<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import InputPhoneNumber from 'lib/components/inputphonenumber/InputPhoneNumber.vue';
import { useForm } from 'vee-validate';
import getUserLocation from 'lib/components/inputphonenumber/helpers/getUserLocation.helper';

const { values } = useForm();

const { country, region, timezone, city } = getUserLocation();
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Input Phone Number" />
    </template>
    <template #subtitle>
      The country code detected from your current language settings. The
      language will determine your region.
    </template>
    <template #content>
      <div
        class="flex flex-col gap-3 p-4 relative bg-[#fff] rounded-[5px] border-2 border-dashed border-[#9747ff]"
      >
        Phone Input with validation

        <br />
        <InputPhoneNumber
          field-name="telp"
          label="Telepon"
          mandatory
          use-validator
        />
        <span>Number: {{ values['telp'] }}</span>
        <span>Your timezone: {{ timezone }}</span>
        <span>Your region: {{ region }}</span>
        <span>Your country: {{ country }}</span>
        <span>Your city: {{ city }}</span>
      </div>
    </template>
  </Card>
</template>
