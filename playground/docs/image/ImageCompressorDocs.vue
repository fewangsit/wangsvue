<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import ImageCompressor from 'lib/components/imagecompressor/ImageCompressor.vue';
import InputText from 'lib/components/inputtext/InputText.vue';
import { shallowRef } from 'vue';
import { useForm } from 'vee-validate';
import InputInititalName from 'lib/components/inputinitialname/InputInititalName.vue';

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
          Existing Initital Names: {{ existingInitialNames }}
        </span>

        <InputText
          v-model="fullName"
          class="mb-4 w-[20vw]"
          label="Name"
          mandatory
        />
        <InputInititalName
          v-model="initialName"
          :existing-initital-names="existingInitialNames"
          :full-name="fullName"
          class="mb-4 w-[20vw]"
          field-name="inititalName"
          label="Initial Name"
        />
        <ImageCompressor :initital-name="initialName" />
      </div>
      <div class="my-10">
        <h3 class="text-xl font-semibold mb-4">Image Input with Validation</h3>
        <ImageCompressor
          :initital-name="initialName"
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
