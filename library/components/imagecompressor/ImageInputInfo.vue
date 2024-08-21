<script setup lang="ts">
import Button from '../button/Button.vue';

defineProps<{
  showInfo: boolean;
  showAddButton?: boolean;
}>();

defineEmits<{
  addPhoto: [];
}>();
</script>
<template>
  <div class="flex flex-col gap-y-4">
    <ul
      v-if="showInfo"
      :class="[
        `[&_li]:before:content-['•']`,
        '[&_li]:before:inline-block [&_li]:before:w-[12px] [&_li]:before:ml-[-12px] pl-3',
        'max-w-[121px] text-body-medium text-general-800 dark:text-general-100 [&_li]:pl-0.5',
      ]"
      data-wv-section="image-requirements-info"
    >
      <li>Max. 1 MB</li>
      <li>Must be image format</li>
    </ul>

    <Button
      v-if="showAddButton"
      @click="$emit('addPhoto')"
      icon="add"
      label="Add Photo"
      text
    />

    <slot />
  </div>
</template>
