<script setup lang="ts">
import { inject, shallowRef } from 'vue';

import Dropdown from 'primevue/dropdown';
import Icon from '../icon/Icon.vue';
import { LiteDropdownEmits, LiteDropdownProps } from './LiteDropdown.vue.d';
import FieldWrapper from '../fieldwrapper/FieldWrapper.vue';
import { OptionValue } from 'lib/types/options.type';

const DropdownPreset = inject<Record<string, any>>('preset').dropdown;

const model = defineModel<OptionValue>({ required: true });

const props = withDefaults(defineProps<LiteDropdownProps>(), {
  filter: true,
  filterPlaceholder: 'Cari',
  placeholder: 'Pilih data',
});

defineEmits<LiteDropdownEmits>();

const isShowOverlay = shallowRef<boolean>(false);
</script>

<template>
  <FieldWrapper :mandatory="props.mandatory">
    <Dropdown
      v-bind="props"
      v-model="model"
      :placeholder="props.loading ? 'Loading...' : props.placeholder"
      :pt="{
        root: ({ state, props }) => ({
          'class': [
            ...DropdownPreset.root({ state, props }).class,
            'text-base',
            {
              'cursor-pointer': !props.disabled,
            },
          ],
          'data-wv-name': 'litedropdown',
        }),
        input: ({ props }) => ({
          class: [
            '!font-semibold',
            {
              '!text-general-200': props.modelValue == null,
              '!text-grayscale-900': props.modelValue != null,
            },
          ],
        }),
      }"
      @change="$emit('change', $event)"
      @hide="isShowOverlay = false"
      @show="
        () => {
          $emit('show');
          isShowOverlay = true;
        }
      "
      class="!w-fit"
    >
      <template #dropdownicon>
        <Icon
          :class="[
            '!w-6 !h-6 !transition-transform !text-general-500',
            { 'rotate-180': isShowOverlay },
          ]"
          icon="arrow-drop-down"
        />
      </template>

      <template #loadingicon>
        <Icon class="text-xs animate-spin duration-200" icon="spinner" />
      </template>

      <template #option="{ option }" v-if="$slots['option']">
        <slot :option="option" name="option" />
      </template>

      <template #filtericon>
        <Icon class="text-xs w-6 h-6" icon="search-line" />
      </template>
    </Dropdown>
  </FieldWrapper>
</template>
