<script setup lang="ts">
import { inject, Ref, ref } from 'vue';
import Icon from 'lib/components/icon/Icon.vue';
import Button from 'lib/components/button/Button.vue';
import DialogAddChecklist from './Dialog/DialogAddChecklist.vue';
import Menu from 'lib/components/menu/Menu.vue';
import { MenuItem } from 'lib/components/menuitem';
import InputText from 'lib/components/inputtext/InputText.vue';
import Form from 'lib/components/form/Form.vue';
import { getAttachmentIcon, useToast } from 'lib/utils';
import eventBus from 'lib/event-bus';
import Checkbox from 'lib/components/checkbox/Checkbox.vue';
import { formatTimeAgo } from '@vueuse/core';
import UserName from 'lib/components/username/UserName.vue';
import ProgressBar from 'lib/components/progressbar/ProgressBar.vue';
import Image from 'lib/components/image/Image.vue';

const toast = useToast();

const taskId = inject<Ref<string>>('taskId');

const showDialogAddChecklist = ref<boolean>(false);
const showAddChecklistItem = ref<boolean>(false);
const addChecklistItemForm = ref();

const selectedCheck = ref();
const moreMenu = ref();

// TODO: Replace me with real data
const checklist = [
  {
    name: 'TODO LIST',
    progress: 33,
    items: [
      {
        isChecked: true,
        name: 'Read The Rust Book Documentation',
        updatedAt: new Date(),
        updatedBy: {
          nickName: 'Rachel',
        },
      },
      {
        isChecked: false,
        name: 'Read The Rust Programming Language Source Code',
        updatedAt: new Date(),
        updatedBy: {
          nickName: 'Mephistopeles',
        },
      },
      {
        isChecked: false,
        name: 'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet',
        updatedAt: new Date(),
        updatedBy: {
          nickName: 'Mephistopeles',
        },
        attachments: [
          {
            filename: 'Document.pdf',
            type: 'file',
            url: 'https://example.com/document.pdf',
            isViewable: true,
          },
          {
            filename: 'Document.xlsx',
            type: 'file',
            url: 'https://example.com/document.xlsx',
          },
          {
            filename: 'Document.csv',
            type: 'file',
            url: 'https://example.com/document.csv',
          },
          {
            type: 'link',
            url: 'https://example.com',
          },
          {
            filename: 'image.png',
            type: 'media',
            thumbnail:
              'https://dev-static-assets.wangs.id/img/wangsit-logo.png',
            url: 'https://example.com/image.png',
            isViewable: true,
          },
          {
            filename: 'video.mp4',
            type: 'media',
            thumbnail:
              'https://dev-static-assets.wangs.id/img/wangsit-logo.png',
            url: 'https://example.com/video.mp4',
            isViewable: true,
          },
        ],
      },
    ],
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
    command: (): void => {
      /**
       * Whenever there are checklist deleted, immediately hide the addChecklistItem,
       * to prevent addChecklistItem section from hanging.
       */
      showAddChecklistItem.value = false;

      // TODO: Delete checklist
    },
  },
];

const handleSaveBtn = (index: number): void => {
  addChecklistItemForm.value[index].submit();
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
          class="!p-1"
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
    <div v-if="checklist.length" class="pl-8 flex flex-col gap-3">
      <Menu ref="moreMenu" :model="moreModel" />
      <div
        :key="index"
        v-for="(check, index) in checklist"
        class="flex flex-col gap-3"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold">{{ check.name }}</span>
          <div class="flex items-center gap-2">
            <ProgressBar
              v-if="check.progress"
              :value="check.progress"
              severity="success"
            />
            <Button
              @click="handleMore($event, check)"
              icon="more"
              icon-class="!w-4 !h-4"
              severity="secondary"
              text
            />
          </div>
        </div>
        <div
          :key="`${index}-${cIndex}`"
          v-for="(item, cIndex) in check.items"
          class="flex flex-col gap-2"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-1 w-2/5">
              <Checkbox v-model="item.isChecked" :label="item.name" />
            </div>
            <div class="flex items-center gap-2">
              <span v-if="item.updatedAt">
                {{ formatTimeAgo(new Date(item.updatedAt)) }}
              </span>
              <UserName
                v-if="item.updatedBy"
                :user="item.updatedBy"
                type="icon"
              />
              <!-- TODO: Handle task item attachment on click -->
              <Button
                class="!p-1"
                icon="attachment-2"
                icon-class="!w-6 !h-6"
                severity="secondary"
                text
              />
              <!-- TODO: Handle task item caption? on click -->
              <Button
                class="!p-1"
                icon="chat-new-line"
                icon-class="!w-6 !h-6"
                severity="secondary"
                text
              />
              <!-- TODO: Handle task item chat on click -->
              <Button
                class="!p-1"
                icon="chat-1-line"
                icon-class="!w-6 !h-6"
                severity="secondary"
                text
              />
              <!-- TODO: Handle task item delete on click -->
              <Button
                class="!p-1"
                icon="close"
                icon-class="!w-6 !h-6"
                severity="danger"
                text
              />
            </div>
          </div>
          <div class="pl-5 flex flex-col gap-2">
            <!-- TODO: break into its own component -->
            <div
              :key="`${index}-${cIndex}-${aIndex}`"
              v-for="(attachment, aIndex) in item.attachments"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <Icon
                  v-if="attachment.type === 'file'"
                  :icon="getAttachmentIcon(attachment.filename)"
                  class="!w-6 !h-6"
                />
                <Icon
                  v-else-if="attachment.type === 'link'"
                  class="!w-6 !h-6"
                  icon="link"
                />
                <Image
                  v-else-if="attachment.type === 'media'"
                  :src="attachment.thumbnail"
                  class="!w-6 !h-6"
                />
                <span v-if="attachment.filename">
                  {{ attachment.filename }}
                </span>
                <a v-else :href="attachment.url" target="_blank">
                  {{ attachment.url }}
                </a>
              </div>
              <div class="flex items-center gap-2">
                <!-- TODO: Handle item attachment preview on click -->
                <Button
                  v-if="attachment.isViewable"
                  class="!p-1"
                  icon="eye"
                  icon-class="!w-5 !h-5"
                  severity="secondary"
                  text
                />
                <!-- TODO: Handle item attachment download on click -->
                <Button
                  class="!p-1"
                  icon="download"
                  icon-class="!w-4 !h-4"
                  severity="secondary"
                  text
                />
                <!-- TODO: Handle item attachment delete on click -->
                <Button
                  class="!p-1"
                  icon="close"
                  icon-class="!w-4 !h-4"
                  severity="danger"
                  text
                />
              </div>
            </div>
          </div>
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
                    @click="handleSaveBtn(index)"
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
  </div>
</template>
