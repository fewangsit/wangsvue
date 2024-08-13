<script lang="ts" setup>
import { ref } from 'vue';
import type {
  ButtonFilterProps,
  ButtonFilterEmits,
} from './ButtonFilter.vue.d';
import { WangsIcons } from '../icon/Icon.vue.d';
import Icon from '../icon/Icon.vue';

defineProps<ButtonFilterProps>();

const emit = defineEmits<ButtonFilterEmits>();

const active = ref<boolean>(false);
const filterIcon = ref<WangsIcons>('filter');

const toggleFilterPanel = (): void => {
  active.value = !active.value;
  filterIcon.value = active.value ? 'filter-fill' : 'filter';

  emit('update:showFilter', active.value);
};
</script>

<template>
  <button @click="toggleFilterPanel">
    <Icon
      :icon="filterIcon"
      class="text-2xl"
      info="Filter"
      severity="secondary"
      tooltip-pos="bottom"
    />
  </button>
</template>
