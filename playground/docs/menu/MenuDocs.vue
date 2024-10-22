<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { MenuItem } from 'lib/components/menuitem';
import Card from 'lib/components/card/Card.vue';
import Menu from 'lib/components/menu/Menu.vue';
import Button from 'lib/components/button/Button.vue';
import DocTitle from '../DocTitle.vue';
import MenuClass from 'lib/components/menu/Menu.vue.d';
import Checkbox from 'lib/components/checkbox/Checkbox.vue';

const menu = ref<MenuClass>();
const noOption = shallowRef<boolean>(false);

const menuList: MenuItem[] = [
  {
    label: 'Action',
    icon: 'checkbox-blank-circle',
  },
  {
    label: 'Action',
    icon: 'checkbox-blank-circle',
  },
  {
    label: 'Danger Action',
    icon: 'checkbox-blank-circle',
    danger: true,
  },
];
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Menu" />
    </template>
    <template #subtitle> Click ellipse button to show menu. </template>
    <template #content>
      <Checkbox
        v-model="noOption"
        label="Check this box to hide all menu option"
      />
      <Button
        @click="menu?.toggle"
        icon="ellipsis-h"
        outlined
        severity="secondary"
        size="small"
      />
      <Menu ref="menu" :model="noOption ? [] : menuList" :popup="true" />
    </template>
  </Card>
</template>
