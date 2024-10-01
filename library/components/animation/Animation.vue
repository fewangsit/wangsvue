<script setup lang="ts">
import { onMounted, shallowRef } from 'vue';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';

const props = defineProps<AnimationProps>();

onMounted(async () => {
  animationData.value = await getAnimationData();
});

const animationData = shallowRef<string>();

const getAnimationData = async (): Promise<string> => {
  return (await import(`../../assets/lottie/${props.animation}.lottie`))
    .default;
};
</script>
<template>
  <DotLottieVue v-if="animationData" :src="animationData" autoplay loop />
</template>
