<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

import PrimeTabMenu from 'primevue/tabmenu';
import type { TabMenuEmits, TabMenuProps } from './TabMenu.vue.d';
import Icon from '../icon/Icon.vue';
import { WangsIcons } from '../icon/Icon.vue.d';

const route = useRoute();

onBeforeMount(() => {
  const index =
    props.menu?.findIndex((item) => item.route === route.path) ?? -1;

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
