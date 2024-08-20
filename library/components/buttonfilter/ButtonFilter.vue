<script lang="ts" setup>
import { ref } from 'vue';
import { WangsIcons } from '../icon/Icon.vue.d';
import { ButtonFilterProps } from './ButtonFilter.vue.d';
import Icon from '../icon/Icon.vue';
import eventBus from 'lib/event-bus';

const { tableName } = defineProps<ButtonFilterProps>();

const active = ref<boolean>(false);
const filterIcon = ref<WangsIcons>('filter');

const toggleFilterPanel = (): void => {
  active.value = !active.value;
  filterIcon.value = active.value ? 'filter-fill' : 'filter';

  eventBus.emit('showFilter', { tableName, show: active.value });
};
</script>

<template>
  <button @click="toggleFilterPanel" type="button">
    <Icon
      :icon="filterIcon"
      class="text-2xl"
      info="Filter"
      severity="secondary"
      tooltip-pos="bottom"
    />
  </button>
</template>
