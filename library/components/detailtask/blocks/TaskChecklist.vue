<script setup lang="ts">
import { inject, Ref, ref } from 'vue';
import Icon from 'lib/components/icon/Icon.vue';
import Button from 'lib/components/button/Button.vue';
import DialogAddChecklist from './Dialog/DialogAddChecklist.vue';
import Menu from 'lib/components/menu/Menu.vue';
import { MenuItem } from 'lib/components/menuitem';
import InputText from 'lib/components/inputtext/InputText.vue';
import Form from 'lib/components/form/Form.vue';
import { useToast } from 'lib/utils';
import eventBus from 'lib/event-bus';

const toast = useToast();

const taskId = inject<Ref<string>>('taskId');

const showDialogAddChecklist = ref<boolean>(false);
const showAddChecklistItem = ref<boolean>(false);
const addChecklistItemForm = ref();

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

const handleSaveBtn = (): void => {
  addChecklistItemForm.value.submit();
};

const handleSave = async (): Promise<void> => {
  try {
    eventBus.emit('detail-task:update', { taskId: taskId.value });
  } catch (error) {
    console.error(error);
    toast.add({
      message: 'Data Item Ceklis gagal disimpan.',
      severity: 'error',
      error,
    });
  }
};

const handleCancel = (): void => {
  showAddChecklistItem.value = false;
};
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
    <div v-if="checklist.length" class="pl-8 flex flex-col gap-3">
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
      <div>
        <Button
          v-if="!showAddChecklistItem"
          @click="showAddChecklistItem = true"
          icon="add"
          label="Item"
          severity="secondary"
        />
        <Form
          ref="addChecklistItemForm"
          v-else
          @submit="handleSave"
          hide-footer
          hide-stay-checkbox
        >
          <template #fields>
            <div class="flex flex-col gap-2">
              <InputText
                :validator-message="{
                  empty: 'Item ceklis harus diisi.',
                }"
                class="[&_label]:hidden"
                label="Item ceklis"
                mandatory
                placeholder="Tulis item ceklis"
                use-validator
              />
              <div class="flex items-center gap-2">
                <Button
                  @click="handleSaveBtn"
                  label="Simpan"
                  severity="success"
                />
                <Button
                  @click="handleCancel"
                  label="Batal"
                  severity="secondary"
                  text
                />
              </div>
            </div>
          </template>
        </Form>
      </div>
    </div>
  </div>
</template>
