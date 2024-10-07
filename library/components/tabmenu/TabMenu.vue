<script setup lang="ts">
import { onBeforeMount, watch } from 'vue';
import { useRoute } from 'vue-router';

import PrimeTabMenu from 'primevue/tabmenu';
import type { TabMenuEmits, TabMenuProps } from './TabMenu.vue.d';
import Icon from '../icon/Icon.vue';
import { WangsIcons } from '../icon/Icon.vue.d';

const route = useRoute();

onBeforeMount(() => {
  setActiveIndex(route.path);
});

const props = withDefaults(defineProps<TabMenuProps>(), {
  useTrailingLine: true,
});

const emit = defineEmits<TabMenuEmits>();
const activeIndex = defineModel<number>('activeIndex', {
  default: 0,
});

const menuPassThrough = props.useTrailingLine
  ? undefined
  : {
      inkbar: {
        class: 'hidden',
      },
    };

const setActiveIndex = (routePath: string): void => {
  // Find index from the element where routePath is exactly item.route
  let index = props.menu?.findIndex(
    (item) => item.route && routePath === item.route,
  );

  // If cannot find exact match, find index where routePath includes item.route
  if (index === -1) {
    index = props.menu?.findIndex(
      (item) => item.route && routePath.includes(item.route),
    );
  }

  if (index !== -1) {
    activeIndex.value = index as number;
  }
};

watch(
  () => route.path,
  (routePath) => {
    setActiveIndex(routePath);
  },
);
</script>

<template>
  <PrimeTabMenu
    v-model:activeIndex="activeIndex"
    :model="menu"
    :pt="menuPassThrough"
    @tab-change="emit('tab-change', $event)"
    data-wv-name="tabmenu"
  >
    <template #item="{ item, props: tabProps }">
      <router-link
        v-slot="{ href, navigate }"
        v-if="item.route"
        :to="item.route"
        custom
      >
        <a v-ripple :href="href" v-bind="tabProps.action" @click="navigate">
          <Icon
            v-if="item.icon"
            v-bind="tabProps.icon"
            :icon="item.icon as WangsIcons"
          />
          <span v-bind="tabProps.label">{{ item.label }}</span>
        </a>
      </router-link>

      <a
        v-else
        v-ripple
        :href="item.url"
        :target="item.target"
        v-bind="tabProps.action"
      >
        <Icon
          v-if="item.icon"
          v-bind="tabProps.icon"
          :icon="item.icon as WangsIcons"
        />
        <span v-bind="tabProps.label">{{ item.label }}</span>
      </a>
    </template>
  </PrimeTabMenu>
</template>
