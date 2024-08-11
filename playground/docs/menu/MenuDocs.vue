<script setup lang="ts">
import { MenuItem } from 'lib/components/menuitem/MenuItem.vue.d';
import Card from 'wangsvue/card';
import Menu from 'wangsvue/menu';
import Button from 'wangsvue/button';
import DocTitle from '../DocTitle.vue';
import { ref } from 'vue';
import MenuClass from 'lib/components/menu/Menu.vue.d';

const menu = ref<MenuClass>();

const menuList: MenuItem[] = [
  {
    label: 'Action',
    icon: 'checkbox-blank-circle-line',
  },
  {
    label: 'Action',
    icon: 'checkbox-blank-circle-line',
  },
  {
    label: 'Danger Action',
    icon: 'checkbox-blank-circle-line',
    danger: true,
  },
];
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Menu" />
    </template>
    <template #subtitle> Click elipse button to show menu. </template>
    <template #content>
      <Button
        @click="menu?.toggle"
        icon="ellipsis-h"
        outlined
        severity="secondary"
        size="small"
      />
      <Menu ref="menu" :model="menuList" :popup="true" />
    </template>
  </Card>
</template>
