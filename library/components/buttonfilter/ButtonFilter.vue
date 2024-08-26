<script lang="ts" setup>
import { ButtonFilterProps } from './ButtonFilter.vue.d';
import Icon from '../icon/Icon.vue';
import eventBus from 'lib/event-bus';
import { buttonFocusClass } from 'lib/preset/button';

const { tableName } = defineProps<ButtonFilterProps>();

const showFilter = defineModel<boolean>('showFilter', { default: false });

const toggleFilterPanel = (): void => {
  showFilter.value = !showFilter.value;

  eventBus.emit('show-filter', { tableName, show: showFilter.value });
};
</script>

<template>
  <button :class="buttonFocusClass" @click="toggleFilterPanel" type="button">
    <Icon
      :icon="showFilter ? 'filter-fill' : 'filter'"
      class="text-2xl"
      info="Filter"
      severity="secondary"
      tooltip-pos="bottom"
    />
  </button>
</template>
