<script setup lang="ts">
import Icon from 'lib/components/icon/Icon.vue';
import { Dependency } from '../DialogAdjustmentTask.vue.d';

const props = defineProps<Dependency>();
</script>
<template>
  <div class="flex items-center gap-2">
    <span class="flex items-center">
      {{ props.done }}
      <Icon
        class="!w-[24px] !h-[24px] ml-[2px]"
        icon="checkbox-circle-fill"
        severity="success"
      />
    </span>

    <span class="flex items-center">
      {{ props.onProgress ?? 0 }}
      <Icon
        class="!w-[24px] !h-[24px] ml-[2px]"
        icon="close-circle-fill"
        severity="danger"
      />
    </span>
  </div>
</template>
