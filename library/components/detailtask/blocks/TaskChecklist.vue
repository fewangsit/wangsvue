<script setup lang="ts">
import { ref } from 'vue';
import Icon from 'lib/components/icon/Icon.vue';
import Button from 'lib/components/button/Button.vue';
import DialogAddChecklist from './Dialog/DialogAddChecklist.vue';
import Menu from 'lib/components/menu/Menu.vue';
import { MenuItem } from 'lib/components/menuitem';

const showDialogAddChecklist = ref<boolean>(false);

const selectedCheck = ref();
const moreMenu = ref();

const checklist = [
  {
    name: 'Checklist bla-bla-bla',
  },
];

const handleMore = (e: Event, check: any): void => {
  selectedCheck.value = check;

  moreMenu.value.toggle(e);
};

const moreModel: MenuItem[] = [
  {
    icon: 'save',
    label: 'Simpan Template',
  },
  {
    icon: 'delete-bin',
    label: 'Hapus Ceklis',
    danger: true,
  },
];
</script>

<template>
  <div class="flex flex-col gap-3" data-wv-section="detailtask-task-checklist">
    <DialogAddChecklist v-model:visible="showDialogAddChecklist" />
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Icon class="w-6 h-6" icon="check" />
        <div class="text-xs font-semibold">Ceklis</div>
      </div>
      <div class="flex items-center gap-2">
        <!-- TODO: Handle task checklist changelog on click -->
        <Button
          icon="file-history"
          icon-class="!w-6 !h-6"
          severity="secondary"
          text
        />
        <Button
          @click="showDialogAddChecklist = true"
          icon="add"
          label="Ceklis"
          severity="secondary"
        />
      </div>
    </div>
    <!-- TODO: Replace me with real data -->
    <div v-if="checklist" class="pl-8">
      <Menu ref="moreMenu" :model="moreModel" />
      <div
        :key="index"
        v-for="(check, index) in checklist"
        class="flex items-center justify-between"
      >
        <span class="text-xs font-semibold">{{ check.name }}</span>
        <Button
          @click="handleMore($event, check)"
          icon="more"
          icon-class="!w-4 !h-4"
          severity="secondary"
          text
        />
      </div>
    </div>
  </div>
</template>
