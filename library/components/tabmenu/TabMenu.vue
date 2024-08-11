<script setup lang="ts">
import PrimeTabMenu from 'primevue/tabmenu';
import type { TabMenuEmits, TabMenuProps } from './TabMenu.vue.d';
import Icon from '../icon/Icon.vue';
import { WangsIcons } from '../icon/Icon.vue.d';

defineProps<TabMenuProps>();
const emit = defineEmits<TabMenuEmits>();
const activeIndex = defineModel<number>('activeIndex', { default: 0 });
</script>

<template>
  <PrimeTabMenu
    v-model:activeIndex="activeIndex"
    :model="menu"
    @tab-change="emit('tab-change', $event)"
  >
    <template #item="{ item, props }">
      <router-link
        v-slot="{ href, navigate }"
        v-if="item.route"
        :to="item.route"
        custom
      >
        <a v-ripple :href="href" v-bind="props.action" @click="navigate">
          <Icon
            v-if="item.icon"
            v-bind="props.icon"
            :icon="item.icon as WangsIcons"
          />
          <span v-bind="props.label">{{ item.label }}</span>
        </a>
      </router-link>

      <a
        v-else
        v-ripple
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
    </template>
  </PrimeTabMenu>
</template>
