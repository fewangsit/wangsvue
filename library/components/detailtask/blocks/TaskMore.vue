<script setup lang="ts">
import Button from 'lib/components/button/Button.vue';
import Menu from 'lib/components/menu/Menu.vue';
import { MenuItem } from 'lib/components/menuitem';
import { ref } from 'vue';

const moreMenu = ref();

const moreModel: MenuItem[] = [
  {
    label: 'Hapus',
    icon: 'delete-bin',
    danger: true,
    command(): void {
      // TODO: Delete Task
    },
  },
];

const handleMore = (e: Event): void => {
  moreMenu.value.toggle(e);
};
</script>

<template>
  <div data-wv-name="task-more">
    <Menu ref="moreMenu" :model="moreModel" />
    <Button
      @click="handleMore"
      icon="more"
      icon-class="!w-6 !h-6 rotate-90"
      severity="secondary"
      text
    />
  </div>
</template>
