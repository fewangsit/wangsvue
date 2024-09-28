<script setup lang="ts">
import nodataJson from 'lib/components/treetable/animations/nodata.json';
import { LottieAnimation } from 'lottie-web-vue';
</script>

<template>
  <div class="w-full p-4 flex items-center justify-center">
    <LottieAnimation :animation-data="nodataJson" auto-play class="w-36" loop />
  </div>
</template>

<style scoped></style>
