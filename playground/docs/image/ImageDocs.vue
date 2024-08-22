<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Image from 'lib/components/image/Image.vue';

const imagePublicUrl =
  'https://images.unsplash.com/photo-1723556146809-2dcb7c1e0bf1?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
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
    </template>
  </Card>
</template>
