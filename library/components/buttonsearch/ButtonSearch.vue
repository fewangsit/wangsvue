<script setup lang="ts">
import { inject, nextTick, ref, shallowRef } from 'vue';
import Icon from '../icon/Icon.vue';
import { ButtonSearchEmits, ButtonSearchProps } from './ButtonSearch.vue.d';
import InputText from 'primevue/inputtext';
import eventBus from 'lib/event-bus';

const { buttonFocusClass } = inject('preset')?.button;

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
    :class="'w-max ' + buttonFocusClass"
    @click="showSearchForm"
    data-wv-section="buttonsearchtrigger"
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
      () => {
        eventBus.emit('search-table', { tableName, search: query });
        $emit('search', query);
      }
    "
    data-wv-section="searchbox-form"
  >
    <button
      :class="buttonFocusClass"
      @click="
        () => {
          query = undefined;
          showSearchInput = false;
          $emit('collapsed');
          eventBus.emit('search-table', { tableName, search: undefined });
          $emit('search', undefined);
        }
      "
      data-wv-section="buttonsearchtrigger"
      type="button"
    >
      <Icon class="w-6 h-6 text-grayscale-900 shrink-0" icon="arrow-left" />
    </button>

    <InputText
      ref="inputtext"
      :model-value="query"
      @input="updateInput"
      class="!h-max"
      placeholder="Cari"
    />
    <button
      :class="[buttonFocusClass, { invisible: !query }]"
      @click="(query = undefined), focusToInput()"
      data-wv-section="buttonsearchtrigger"
      type="button"
    >
      <Icon :class="['text-2xl shrink-0']" icon="close" />
    </button>
    <button class="hidden" type="submit" />
  </form>
</template>
