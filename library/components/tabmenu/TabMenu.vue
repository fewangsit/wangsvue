<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { WangsIcons } from '../icon/Icon.vue.d';
import { TabMenuEmits, TabMenuProps } from './TabMenu.vue.d';

import PrimeTabMenu from 'primevue/tabmenu';
import Icon from '../icon/Icon.vue';

const route = useRoute();

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
  const findIndexRecursive = (path: string): number | undefined => {
    // Find index from the element where routePath is exactly item.route
    let index = props.menu?.findIndex(
      (item) => item.route && path === item.route,
    );

    // If it cannot find exact match, recursively trim and try to match
    if (index === -1 && path.includes('/')) {
      // Trim the last segment from the path
      const newPath = path.substring(0, path.lastIndexOf('/'));
      index = findIndexRecursive(newPath);
    }

    return index;
  };

  activeIndex.value = findIndexRecursive(routePath);
};

watch(
  () => route.path,
  (routePath) => {
    setActiveIndex(routePath);
  },
  {
    immediate: true,
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
