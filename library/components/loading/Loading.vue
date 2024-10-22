<script setup lang="ts">
import useLoadingStore from './store/loading.store';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import loadingPlane from 'lib/assets/lottie/loading-plane.lottie';

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
      <DotLottieVue
        :src="loadingPlane as string"
        autoplay
        class="w-[450px] h-auto"
        loop
      />

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
