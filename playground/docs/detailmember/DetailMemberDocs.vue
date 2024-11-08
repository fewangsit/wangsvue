<script setup lang="ts">
import DocTitle from '../DocTitle.vue';
import Card from 'lib/components/card/Card.vue';
import DetailMember from 'lib/components/detailmember/DetailMember.vue';
import { MenuItem } from 'lib/components/menuitem';
import TabMenu from 'lib/components/tabmenu/TabMenu.vue';
import Toast from 'lib/components/toast/Toast.vue';
import { shallowRef } from 'vue';

const menu: MenuItem[] = [
  {
    label: 'Task',
  },
  {
    label: 'Tim Leader',
  },
  {
    label: 'Admin Role',
  },
  {
    label: 'Userlog',
  },
];

const activeIndex = shallowRef<number>(0);
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Detail Member" />
    </template>
    <template #content>
      <TabMenu v-model:active-index="activeIndex" :menu="menu" />
      <DetailMember
        :access="{ create: true, read: true, update: true, delete: true }"
        :active-index="activeIndex"
        member-id="66d1771c1ebe5344bc2b9dab"
      />
    </template>
  </Card>
  <Toast />
</template>
