<script setup lang="ts">
import { MenuItem } from 'lib/components/menuitem';
import { shallowRef } from 'vue';
import Card from 'lib/components/card/Card.vue';
import TabMenu from 'lib/components/tabmenu/TabMenu.vue';
import DocTitle from '../DocTitle.vue';

const menu: MenuItem[] = [
  {
    label: 'Tab',
    route: '/tabmenu',
  },
  {
    label: 'Link to Button Docs',
    route: '/button',
  },
  {
    label: 'Without Link',
  },
  {
    label: 'With Link to current page',
    route: '/tabmenu/second-link',
  },
];

const activeIndex = shallowRef(0);
const subActiveIndex = shallowRef(0);
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
    </template>
  </Card>
</template>
