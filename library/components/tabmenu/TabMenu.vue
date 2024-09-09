<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

import PrimeTabMenu from 'primevue/tabmenu';
import type { TabMenuEmits, TabMenuProps } from './TabMenu.vue.d';
import Icon from '../icon/Icon.vue';
import { WangsIcons } from '../icon/Icon.vue.d';

const route = useRoute();

onBeforeMount(() => {
  /**
   * Find index from the last element where the route.path includes the item.route.
   *
   * using findLastIndex because there might be case where there are route menu like these:
   * ['/route/first', '/route/first/second']
   *
   * If our current route is '/route/first/second', the findIndex will take the '/route/first' as true,
   * even though we are aiming to set the '/route/first/second' as the current index.
   *
   * following Left to Right (LTR) writing convention. It can't cover the opposite (RTL), though.
   * Maybe we should add a prop to use findIndex or findLastIndex for that. (Default to findLastIndex (LTR))
   */
  const index =
    props.menu?.findLastIndex((item) => route.path.includes(item.route)) ?? -1;

  if (index !== -1) {
    activeIndex.value = index;
  }
});

const props = withDefaults(defineProps<TabMenuProps>(), {
  useTrailingLine: true,
});
const emit = defineEmits<TabMenuEmits>();
const activeIndex = defineModel<number>('activeIndex', {
  default: 0,
});
</script>

<template>
  <PrimeTabMenu
    v-model:activeIndex="activeIndex"
    :model="menu"
    :pt="
      useTrailingLine
        ? undefined
        : {
            inkbar: {
              class: 'hidden',
            },
          }
    "
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
