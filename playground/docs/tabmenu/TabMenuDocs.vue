<script setup lang="ts">
import { MenuItem } from 'lib/components/menuitem/MenuItem.vue.d';
import { shallowRef } from 'vue';
import Card from 'wangsvue/card';
import TabMenu from 'wangsvue/tabmenu';
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
];

const activeIndex = shallowRef(0);
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Tab Menu" />
      <TabMenu v-model:active-index="activeIndex" :menu="menu" />
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
