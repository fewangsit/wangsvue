<script setup lang="ts">
import eventBus from 'lib/event-bus';
import InputText from 'primevue/inputtext';
import { inject, nextTick, ref, shallowRef } from 'vue';
import Icon from '../icon/Icon.vue';
import { ButtonSearchEmits, ButtonSearchProps } from './ButtonSearch.vue.d';

const { buttonFocusClass } = inject<Record<string, any>>('preset', {}).button;

const ButtonSearchPreset = inject<Record<string, any>>(
  'preset',
  {},
).buttonsearch;

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
    v-bind="ButtonSearchPreset?.buttontrigger(buttonFocusClass)"
    @click="showSearchForm"
    type="button"
  >
    <Icon
      v-bind="ButtonSearchPreset?.icon()"
      icon="search"
      info="Search"
      severity="secondary"
      tooltip-pos="bottom"
    />
  </button>
  <form
    v-else
    v-bind="ButtonSearchPreset?.form(showSearchInput)"
    @submit.prevent="
      () => {
        eventBus.emit('search-table', { tableName, search: query });
        $emit('search', query);
      }
    "
  >
    <button
      v-bind="
        ButtonSearchPreset?.buttontrigger(buttonFocusClass, showSearchInput)
      "
      @click="
        () => {
          query = undefined;
          showSearchInput = false;
          $emit('collapsed');
          eventBus.emit('search-table', { tableName, search: undefined });
          $emit('search', undefined);
        }
      "
      type="button"
    >
      <Icon
        v-bind="ButtonSearchPreset?.icon(showSearchInput)"
        icon="arrow-left"
      />
    </button>

    <InputText
      v-bind="ButtonSearchPreset?.inputtext"
      ref="inputtext"
      :model-value="query"
      @input="updateInput"
      placeholder="Cari"
    />
    <button
      v-bind="ButtonSearchPreset?.buttonclose(buttonFocusClass, query)"
      @click="(query = undefined), focusToInput()"
      type="button"
    >
      <Icon v-bind="ButtonSearchPreset?.iconclose" icon="close" />
    </button>
    <button v-bind="ButtonSearchPreset?.buttonsubmit" type="submit" />
  </form>
</template>
