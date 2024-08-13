<script lang="ts" setup>
import { ref } from 'vue';
import Button from '../button/Button.vue';
import type {
  ButtonFilterProps,
  ButtonFilterEmits,
} from './ButtonFilter.vue.d';
import { WangsIcons } from '../icon/Icon.vue.d';

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
  <Button
    :icon="filterIcon"
    :text="!active"
    @click="toggleFilterPanel"
    data-section-name="buttonfilter"
    severity="secondary"
    tooltip="Filter"
  />
</template>
