<script setup lang="ts">
import useLoadingStore from './store/loading.store';
import { LottieAnimation } from 'lottie-web-vue';
import loadingJson from './loading.json';

const { loading } = useLoadingStore();
</script>

<template>
  <Teleport v-if="loading" to="body">
    <div
      :class="[
        'w-screen h-screen fixed top-0 left-0 z-[9999999]',
        'bg-white',
        'flex items-center justify-center',
        'transition-opacity',
      ]"
      data-wv-name="loading-overlay"
      data-wv-section="overlay"
    >
      <LottieAnimation
        :animation-data="loadingJson"
        auto-play
        class="w-96"
        loop
      />
    </div>
  </Teleport>
</template>

<style>
body.loading,
body.loading * {
  overflow: hidden;
}
</style>
