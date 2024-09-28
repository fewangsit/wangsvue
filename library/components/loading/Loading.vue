<script setup lang="ts">
import useLoadingStore from './store/loading.store';
import { Vue3Lottie } from 'vue3-lottie';
import loadingJson from './loading.json';

const { loading, message } = useLoadingStore();
</script>

<template>
  <Teleport v-if="loading" to="body">
    <div
      :class="[
        'w-screen h-screen fixed top-0 left-0 z-[9999999]',
        'bg-white',
        'flex flex-col gap-3 items-center justify-center',
        'transition-opacity',
      ]"
      data-wv-name="loading-overlay"
      data-wv-section="overlay"
    >
      <Vue3Lottie :animation-data="loadingJson" auto-play class="w-96" loop />

      {{ message }}
    </div>
  </Teleport>
</template>

<style>
body.loading,
body.loading * {
  overflow: hidden;
}
</style>
