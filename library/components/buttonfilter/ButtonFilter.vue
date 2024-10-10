<script lang="ts" setup>
import { inject, shallowRef } from 'vue';
import { ButtonFilterProps } from './ButtonFilter.vue.d';
import Icon from '../icon/Icon.vue';
import eventBus from 'lib/event-bus';

const { buttonFocusClass } = inject<Record<string, any>>('preset').button;

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
