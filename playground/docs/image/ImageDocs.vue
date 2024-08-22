<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Image from 'lib/components/image/Image.vue';
import ImageCompressor from 'lib/components/imagecompressor/ImageCompressor.vue';
import InputText from 'lib/components/inputtext/InputText.vue';
import { shallowRef } from 'vue';
import { useForm } from 'vee-validate';

const { values } = useForm();

const imagePublicUrl =
  'https://images.unsplash.com/photo-1723556146809-2dcb7c1e0bf1?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const fullName = shallowRef('Zain Kurnia');
const initialName = shallowRef('ZK');
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Image" />
    </template>
    <template #content>
      <div class="flex gap-10">
        <Image :thumbnail="imagePublicUrl" />
        <Image :thumbnail="imagePublicUrl" rounded />
        <Image />
        <Image rounded />
      </div>

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
