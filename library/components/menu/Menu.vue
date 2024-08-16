<script setup lang="ts">
import { WangsIcons } from '../icon/Icon.vue.d';
import Icon from '../icon/Icon.vue';
import PrimeMenu from 'primevue/menu';
import Menu, { MenuEmits, MenuProps } from './Menu.vue.d';
import { ref } from 'vue';

withDefaults(defineProps<MenuProps>(), { popup: true });
defineEmits<MenuEmits>();

const menu = ref<Menu>();
const toggle = (e: Event): void => {
  menu.value?.toggle(e);
};

const show = (e: Event): void => {
  menu.value?.show(e);
};

const hide = (): void => {
  menu.value?.hide();
};

defineExpose({
  toggle,
  show,
  hide,
});
</script>

<template>
  <PrimeMenu
    v-bind="$props"
    ref="menu"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
  >
    <template #item="{ item, props }">
      <a
        @click.stop="item.command?.({ originalEvent: $event, item })"
        v-bind="props.action"
        aria-hidden="true"
        data-pc-section="action"
        tabindex="-1"
      >
        <Icon
          v-if="item.icon"
          :icon="item.icon as WangsIcons"
          :severity="item.danger ? 'danger' : undefined"
          v-bind="props.icon"
        />

        <span
          :class="['text-inherit', { '!text-danger-500': item.danger }]"
          data-pc-section="label"
        >
          {{ item.label }}
        </span>
      </a>
    </template>

    <template #start v-if="$slots['start']">
      <slot name="start" />
    </template>
  </PrimeMenu>
</template>
