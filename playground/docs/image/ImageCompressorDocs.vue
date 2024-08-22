<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import ImageCompressor from 'lib/components/imagecompressor/ImageCompressor.vue';
import InputText from 'lib/components/inputtext/InputText.vue';
import { shallowRef } from 'vue';
import { useForm } from 'vee-validate';

const { values } = useForm();

const fullName = shallowRef('Zain Kurnia');
const initialName = shallowRef('ZK');
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
          Try to remove initial name value, the full name will be converted into
          initial name
        </span>

        <InputText
          v-model="fullName"
          class="mb-4 w-[20vw]"
          label="Name"
          mandatory
        />
        <InputText
          v-model="initialName"
          class="mb-4 w-[20vw]"
          label="Inisial Name"
        />
        <ImageCompressor :full-name="fullName" :initital-name="initialName" />
      </div>
      <div class="my-10">
        <h3 class="text-xl font-semibold mb-4">Image Input with Validation</h3>
        <ImageCompressor
          :full-name="fullName"
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
