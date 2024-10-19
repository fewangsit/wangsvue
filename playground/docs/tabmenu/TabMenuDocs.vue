<script setup lang="ts">
import { MenuItem } from 'lib/components/menuitem';
import { shallowRef } from 'vue';
import Card from 'lib/components/card/Card.vue';
import TabMenu from 'lib/components/tabmenu/TabMenu.vue';
import DocTitle from '../DocTitle.vue';
import Tab from './tabs/Tab.vue';
import AnotherTab from './tabs/AnotherTab.vue';

const menu: MenuItem[] = [
  {
    label: 'Link to Button Docs',
    route: '/button',
  },
  {
    label: 'With Link to current page',
    route: '/tabmenu/second-link',
  },
  {
    label: 'Tab',
    route: '/tabmenu',
  },
];

const subTabMenus: MenuItem[] = [
  {
    label: 'Sub Tab 1',
  },
  {
    label: 'Sub Tab 2',
  },
];

const activeIndex = shallowRef(0);
const subActiveIndex = shallowRef(0);
const subTabActiveIndex = shallowRef(0);
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Tab Menu" />
      <div class="flex flex-col gap-4">
        <span>With Trailing Line</span>
        <TabMenu v-model:active-index="activeIndex" :menu="menu" />
        <span>Without Trailing Line</span>
        <TabMenu
          v-model:active-index="activeIndex"
          :menu="menu"
          :use-trailing-line="false"
        />
        <TabMenu
          v-model:active-index="subActiveIndex"
          :menu="[
            {
              label: 'With Link to current page > children',
              route: '/tabmenu/second-link/children',
            },
            {
              label: 'With Link to current page > children 2',
              route: '/tabmenu/second-link/children-2',
            },
          ]"
          :use-trailing-line="false"
        />
      </div>
    </template>
    <template #subtitle>
      You are currently on tab {{ activeIndex + 1 }}.
    </template>
    <template #content>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet
      praesentium architecto quae hic vel, consequatur voluptate ea impedit, sit
      nostrum ratione blanditiis ex sapiente labore ullam? Iste atque aut ipsum.

      <h3 class="mt-2">TAB Menu without routes</h3>
      <TabMenu v-model:active-index="subTabActiveIndex" :menu="subTabMenus" />

      <Tab v-if="!subTabActiveIndex" />
      <AnotherTab v-else />
    </template>
  </Card>
</template>
