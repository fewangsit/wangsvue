<script setup lang="ts">
import Menu, { MenuEmits, MenuProps } from './Menu.vue.d';
import { inject, ref } from 'vue';
import { WangsIcons } from '../icon/Icon.vue.d';
import Icon from '../icon/Icon.vue';
import PrimeMenu from 'primevue/menu';

withDefaults(defineProps<MenuProps>(), { popup: true });
defineEmits<MenuEmits>();

const Preset = inject<Record<string, any>>('preset', {}).menu;

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
      <router-link
        v-slot="{ href, navigate }"
        v-if="item.route"
        :to="item.route"
        custom
      >
        <a :href="href" v-bind="props.action" @click="navigate">
          <Icon
            v-if="item.icon"
            v-bind="props.icon"
            :icon="item.icon as WangsIcons"
          />
          <span v-bind="props.label">{{ item.label }}</span>
        </a>
      </router-link>

      <a
        v-else-if="item.url"
        :href="item.url"
        :target="item.target"
        v-bind="props.action"
      >
        <Icon
          v-if="item.icon"
          v-bind="props.icon"
          :icon="item.icon as WangsIcons"
        />
        <span v-bind="props.label">{{ item.label }}</span>
      </a>

      <a
        v-else
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
          v-bind="
            Preset?.label({
              props: { danger: item.danger },
            })
          "
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
