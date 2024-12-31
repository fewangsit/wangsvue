<script setup lang="ts">
import { inject, ref, shallowRef } from 'vue';
import Button from 'lib/components/button/Button.vue';
import Menu from 'lib/components/menu/Menu.vue';
import { MenuItem } from 'lib/components/menuitem';
import { TaskDetailData } from 'lib/types/task.type';
import DialogConfirmDeleteTask from './DialogConfirmDeleteTask.vue';
import { DetailTaskEmits } from '../../TaskDetail.vue.d';

const refreshTaskHandler =
  inject<(eventName: keyof DetailTaskEmits, id?: string) => Promise<void>>(
    'refreshTaskHandler',
  );

const props = defineProps<{
  taskDetail: TaskDetailData;
}>();

const moreMenu = ref();
const deleteConfirm = shallowRef<boolean>(false);

const moreModel: MenuItem[] = [
  {
    label: 'Hapus',
    icon: 'delete-bin',
    danger: true,
    command: (): void => {
      deleteConfirm.value = true;
    },
  },
];

const toggleMenu = (e: Event): void => {
  moreMenu.value.toggle(e);
};
</script>

<template>
  <div data-wv-name="task-more">
    <Menu ref="moreMenu" :model="moreModel" />
    <Button
      @click="toggleMenu"
      class="!p-1"
      icon="more"
      icon-class="!w-6 !h-6 rotate-90"
      severity="secondary"
      text
    />
  </div>

  <DialogConfirmDeleteTask
    v-model:visible="deleteConfirm"
    :tasks="[props.taskDetail]"
    @saved="refreshTaskHandler('delete', props.taskDetail._id)"
  />
</template>
