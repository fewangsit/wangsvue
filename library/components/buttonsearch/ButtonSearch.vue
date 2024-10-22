<script setup lang="ts">
import { inject, nextTick, ref, shallowRef } from 'vue';
import { ButtonSearchEmits, ButtonSearchProps } from './ButtonSearch.vue.d';

import Icon from '../icon/Icon.vue';
import eventBus from 'lib/event-bus';
import InputText from 'primevue/inputtext';

const Preset = inject<Record<string, any>>('preset', {}).buttonsearch;

withDefaults(defineProps<ButtonSearchProps>(), {
  tableName: 'datatable',
});

defineEmits<ButtonSearchEmits>();

const query = shallowRef<string>();
const inputtext = ref();
const showSearchInput = shallowRef(false);

const showSearchForm = (): void => {
  showSearchInput.value = true;

  focusToInput();
};

const focusToInput = (): void => {
  nextTick(() => {
    if (inputtext.value) {
      inputtext.value['$el'].focus();
    }
  });
};

/**
 * Need to update the query on input to show the clear (x) icon.
 * PrimeVue only update modelValue if input has loosened focus
 */
const updateInput = (event: Event): void => {
  /**
   * If query is empty string, undefined will be assigned.
   * This will ensure the 'search' field always removed while fetching data.
   */
  query.value = (event.target as HTMLInputElement).value || undefined;
};
</script>

<template>
  <button
    v-if="!showSearchInput"
    @click="showSearchForm"
    v-bind="Preset?.buttontrigger.root({ context: { showSearchInput } })"
    type="button"
  >
    <Icon
      v-bind="Preset?.buttontrigger.icon"
      icon="search"
      info="Search"
      severity="secondary"
      tooltip-pos="bottom"
    />
  </button>

  <form
    v-else
    v-bind="Preset?.form({ context: { showSearchInput } })"
    @submit.prevent="
      () => {
        eventBus.emit('search-table', { tableName, search: query });
        $emit('search', query);
      }
    "
  >
    <button
      @click="
        () => {
          query = undefined;
          showSearchInput = false;
          $emit('collapsed');
          eventBus.emit('search-table', { tableName, search: undefined });
          $emit('search', undefined);
        }
      "
      v-bind="Preset?.collapsebutton.root({ context: { showSearchInput } })"
      type="button"
    >
      <Icon v-bind="Preset?.collapsebutton.icon" icon="arrow-left" />
    </button>

    <InputText
      v-bind="Preset?.inputtext"
      ref="inputtext"
      :model-value="query"
      @input="updateInput"
      placeholder="Cari"
    />

    <button
      @click="
        query = undefined;
        focusToInput();
      "
      v-bind="Preset?.resetbutton.root({ query })"
      type="button"
    >
      <Icon v-bind="Preset?.resetbutton.icon" icon="close" />
    </button>

    <button v-bind="Preset?.hiddensubmit" type="submit" />
  </form>
</template>
