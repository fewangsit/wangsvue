<script setup lang="ts">
import { onMounted, shallowRef } from 'vue';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import { AnimationProps } from './Animation.vue.d';

const props = defineProps<AnimationProps>();

onMounted(async () => {
  animationData.value = await getAnimationData();
});

const animationData = shallowRef<string>();

const getAnimationData = async (): Promise<string> => {
  const animationPath = `../../assets/lottie/${props.animation}.lottie`;
  return (await import(animationPath)).default;
};
</script>
<template>
  <DotLottieVue v-if="animationData" :src="animationData" autoplay loop />
</template>
