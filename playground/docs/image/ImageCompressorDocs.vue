<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import ImageCompressor from 'lib/components/imagecompressor/ImageCompressor.vue';
import InputText from 'lib/components/inputtext/InputText.vue';
import { shallowRef } from 'vue';
import { useForm } from 'vee-validate';
import InputInitialName from 'lib/components/inputinitialname/InputInitialName.vue';

const { values } = useForm();

const fullName = shallowRef('Zain Kurnia');
const initialName = shallowRef();
const existingInitialNames = ['ZK', 'ZNK', 'KRN', 'ZAI'];
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Image Compressor" />
    </template>
    <template #content>
      <div class="my-10">
        <h3 class="text-xl font-semibold mb-2">Image Input</h3>

        <span class="block mb-4">
          Existing Initial Names: {{ existingInitialNames }}
        </span>

        <InputText
          v-model="fullName"
          class="mb-4 w-[20vw]"
          label="Name"
          mandatory
        />
        <InputInitialName
          v-model="initialName"
          :existing-initial-names="existingInitialNames"
          :full-name="fullName"
          class="mb-4 w-[20vw]"
          field-name="initialName"
          label="Initial Name"
          mandatory
          use-validator
        />
        <ImageCompressor :initial-name="initialName" />
      </div>
      <div class="my-10">
        <h3 class="text-xl font-semibold mb-4">Image Input with Validation</h3>
        <ImageCompressor
          :initial-name="initialName"
          field-name="image"
          use-validator
        />
        <span class="block mt-4">
          The inputted image: {{ values['image'] }}
        </span>
      </div>
    </template>
  </Card>
</template>
