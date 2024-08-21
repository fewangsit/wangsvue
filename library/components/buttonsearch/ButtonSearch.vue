<script setup lang="ts">
import { shallowRef } from 'vue';
import Icon from '../icon/Icon.vue';
import { ButtonSearchEmits, ButtonSearchProps } from './ButtonSearch.vue.d';
import InputText from 'primevue/inputtext';
import eventBus from 'lib/event-bus';

withDefaults(defineProps<ButtonSearchProps>(), {
  tableName: 'datatable',
});

defineEmits<ButtonSearchEmits>();

const query = shallowRef<string>();
const showSearchInput = shallowRef(false);

/**
 * Need to update the query on input to show the clear (x) icon.
 * PrimeVue only update modelValue if input has losen focus
 */
const updateInput = (event: Event): void => {
  /**
   * If query is empty string, undefine will be assigned.
   * This will ensure the 'search' field always removed while fetching data.
   */
  query.value = (event.target as HTMLInputElement).value || undefined;
};
</script>

<template>
  <button
    v-if="!showSearchInput"
    @click="showSearchInput = !showSearchInput"
    type="button"
  >
    <Icon
      class="text-2xl"
      icon="search"
      info="Search"
      severity="secondary"
      tooltip-pos="bottom"
    />
  </button>
  <form
    v-else
    :class="[
      { show: showSearchInput },
      'grid grid-cols-[max-content,auto,max-content] items-center gap-0.5 max-w-[224px] h-6',
      'border-b border-primary-100',
    ]"
    @submit.prevent="
      eventBus.emit('search-table', { tableName, search: query })
    "
    data-section-name="searchbox-form"
  >
    <Icon
      @click="
        () => {
          query = undefined;
          showSearchInput = false;
          $emit('collapsed');
          eventBus.emit('search-table', { tableName, search: undefined });
        }
      "
      class="w-6 h-6 text-grayscale-900 shrink-0"
      icon="arrow-left"
    />

    <InputText
      v-focus
      :model-value="query"
      @input="updateInput"
      class="!h-max"
      placeholder="Cari"
    />

    <Icon
      :class="['text-2xl shrink-0', { invisible: !query }]"
      @click="query = undefined"
      icon="close"
    />
    <button class="hidden" type="submit" />
  </form>
</template>
