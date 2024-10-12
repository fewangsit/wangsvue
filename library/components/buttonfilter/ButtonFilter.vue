<script lang="ts" setup>
import eventBus from 'lib/event-bus';
import { inject, shallowRef } from 'vue';
import Icon from '../icon/Icon.vue';
import { ButtonFilterProps } from './ButtonFilter.vue.d';

const { buttonFocusClass } = inject<Record<string, any>>('preset', {}).button;

const ButtonFilterPreset = inject<Record<string, any>>(
  'preset',
  {},
).buttonfilter;

const { tableName } = withDefaults(defineProps<ButtonFilterProps>(), {
  tableName: 'datatable',
});

const emit = defineEmits<{
  showFilter: [payload: boolean];
}>();

const showFilter = shallowRef<boolean>(false);

const toggleFilterPanel = (): void => {
  showFilter.value = !showFilter.value;
  emit('showFilter', showFilter.value);
  eventBus.emit('show-filter', { tableName, show: showFilter.value });
};
</script>

<template>
  <button
    v-bind="ButtonFilterPreset?.buttontrigger"
    @click="toggleFilterPanel"
    type="button"
  >
    <Icon
      v-bind="ButtonFilterPreset?.icon"
      :icon="showFilter ? 'filter-fill' : 'filter'"
      info="Filter"
      severity="secondary"
      tooltip-pos="bottom"
    />
  </button>
</template>
