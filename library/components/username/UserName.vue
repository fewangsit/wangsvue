<script setup lang="ts">
const props = defineProps<{
  user: { [key: string]: any };
}>();
</script>

<template>
  <div class="flex items-center gap-1">
    <img
      alt=""
      class="w-[30px] h-[30px] object-cover"
      src="https://assets.tagsamurai.com/img/USER-PROFILE.svg"
    />
    <div class="text-xs font-normal">{{ props.user.nickName }}</div>
  </div>
</template>
