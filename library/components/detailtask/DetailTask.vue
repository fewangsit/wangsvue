<script setup lang="ts">
import { computed, provide, ref, shallowRef } from 'vue';

import Dialog from 'primevue/dialog';
import DialogPreset from 'lib/preset/dialog';
import Legend from './blocks/Legend.vue';
import Button from '../button/Button.vue';
import { DetailTaskProps } from './DetailTask.vue.d';
import { MenuItem } from '../menuitem';
import TabMenu from '../tabmenu/TabMenu.vue';
import InfoTaskTab from './blocks/Tabs/InfoTaskTab.vue';

const visible = defineModel<boolean>('visible', { required: true });

const props = withDefaults(defineProps<DetailTaskProps>(), {
  taskId: undefined,
});

const isNewTask = ref<boolean>(!props.taskId);

const taskMenuIndex = shallowRef<number>(0);
const taskMenu = computed<MenuItem[]>(() => {
  return [
    {
      label: 'Info Task',
      disabled: isNewTask.value,
    },
    {
      label: 'Deskripsi',
      disabled: isNewTask.value,
    },
    {
      label: 'Review',
      disabled: isNewTask.value,
    },
    {
      label: 'Event Log',
      disabled: isNewTask.value,
    },
  ];
});

provide('isNewTask', isNewTask);
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :closable="false"
    :draggable="false"
    :pt="{
      root: () => ({
        'class': [
          ...DialogPreset.root({ state: {} }).class,

          //   Customs
          '!w-[clamp(800px,800px,1200px)]',
          '!h-[648px]',
          '!border-grayscale-900 !border',
          '!p-0',
          '!gap-0',
        ],
        'data-wv-section': $attrs['data-wv-section'] ?? 'root',
        'data-wv-name': $attrs['data-wv-name'] ?? 'detailtask',
      }),
      header: {
        'class': [
          ...DialogPreset.header.class,

          // Customs
          '!px-6',
          '!h-12',
          '!gap-0',
          '!border-grayscale-900 !border-b',
        ],
        'data-wv-section': 'detailtask-header',
      },
      content: {
        class: [
          ...DialogPreset.content({ state: {}, instance: {} }).class,

          // Customs
          '!p-0 !m-0',
          '!pl-6 !py-3 !pr-3 !mr-3',
        ],
      },
      footer: {
        class: [...DialogPreset.footer.class],
      },
    }"
    modal
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <span class="text-lg font-semibold leading-4">Detail Task</span>
        <div class="flex items-center gap-1.5">
          <Button
            @click="visible = false"
            class="!p-0.5 !text-general-200 dark:!text-general-200"
            data-wv-section="closebutton"
            icon="close"
            icon-class="w-[22px] h-[22px]"
            severity="secondary"
            text
          />
        </div>
      </div>
    </template>
    <template #default>
      <Legend />
      <TabMenu v-model:active-index="taskMenuIndex" :menu="taskMenu" />
      <div>
        <InfoTaskTab v-if="taskMenuIndex === 0" />
      </div>
    </template>
  </Dialog>
</template>
