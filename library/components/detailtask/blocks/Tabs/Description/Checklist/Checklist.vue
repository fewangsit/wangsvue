<script setup lang="ts">
import { inject, nextTick, Ref, ref, watch } from 'vue';
import Icon from 'lib/components/icon/Icon.vue';
import Button from 'lib/components/button/Button.vue';
import Menu from 'lib/components/menu/Menu.vue';
import { MenuItem } from 'lib/components/menuitem';
import { useToast } from 'lib/utils';
import Checkbox from 'lib/components/checkbox/Checkbox.vue';
import UserName from 'lib/components/username/UserName.vue';
import ProgressBar from 'lib/components/progressbar/ProgressBar.vue';
import TaskChecklistServices from 'lib/services/taskChecklist.service';
import { TaskChecklist, TaskChecklistItem } from 'lib/types/task.type';
import {
  AddTaskChecklistItemDTO,
  ToggleTaskChecklistItemDTO,
} from 'lib/dto/taskChecklist.dto';
import { formatDateReadable } from 'lib/utils/date.util';
import DialogAddAttachment from '../../../common/DialogAddAttachment.vue';
import InputAdditional from '../../../common/InputAdditional.vue';
import TaskAttachmentItem from '../Attachment/AttachmentItem.vue';
import DialogConfirmChecklist from './DialogConfirmChecklist.vue';
import DialogSaveChecklistTemplate from './DialogSaveChecklistTemplate.vue';
import DialogDetailChecklistTemplate from './DialogDetailChecklistTemplate.vue';
import DialogAddChecklist from './DialogAddChecklist.vue';

const toast = useToast();

const taskId = inject<Ref<string>>('taskId');

const checklistMenuOptions: MenuItem[] = [
  {
    icon: 'save',
    label: 'Simpan Template',
    command: (): void => {
      dialogSaveChecklistTemplate.value = true;
    },
  },
  {
    icon: 'file-copy-2-line',
    label: 'Detail Template',
    command: (): void => {
      dialogDetailChecklistTemplate.value = true;
    },
  },
  {
    icon: 'delete-bin',
    label: 'Hapus Ceklis',
    danger: true,
    command: (): void => {
      dialogDeleteChecklist.value = true;
    },
  },
];

const checklists = ref<TaskChecklist[]>();

const dialogAddChecklist = ref<boolean>(false);
const dialogSaveChecklistTemplate = ref<boolean>(false);
const dialogDetailChecklistTemplate = ref<boolean>(false);
const dialogDeleteChecklist = ref<boolean>(false);
const dialogDeleteChecklistItem = ref<boolean>(false);
const dialogUncheckChecklistItem = ref<boolean>(false);
const dialogAddAttachment = ref<boolean>(false);

const selectedChecklist = ref<TaskChecklist>();
const selectedChecklistItem = ref<TaskChecklistItem>();
const moreMenu = ref();

const togglingItem = ref(false);

const handleMore = (e: Event, check: any): void => {
  selectedChecklist.value = check;
  moreMenu.value.toggle(e);
};

const addChecklistItem = async (item: string, index: number): Promise<void> => {
  try {
    const body: AddTaskChecklistItemDTO = {
      checklist: checklists.value[index]._id,
      name: item,
    };
    const { data } = await TaskChecklistServices.addTaskChecklistItem(body);
    if (data) {
      closeInputAddItem(index);
      getChecklists();
    }
  } catch (error) {
    toast.add({
      message: 'Item ceklis gagal disimpan.',
      error,
    });
  }
};

const closeInputAddItem = (index: number): void => {
  checklists.value[index].showAddItem = false;
};

const getChecklists = async (): Promise<void> => {
  try {
    const { data } = await TaskChecklistServices.getTaskChecklists(
      taskId.value,
    );
    if (data) {
      checklists.value = data.data.map((d) => ({
        ...d,
        checklistItems: d.checklistItems.map((item) => ({
          ...item,
          key: 0,
        })),
      }));
    }
  } catch (error) {
    toast.add({
      message: 'Gagal memuat data ceklis.',
      error,
    });
  }
};

const renameChecklist = async (index: number, name: string): Promise<void> => {
  try {
    const checklist = checklists.value[index];
    const { data } = await TaskChecklistServices.updateTaskChecklist(
      checklist._id,
      { name },
    );
    if (data) {
      checklist.showRenameChecklist = false;
      await getChecklists();
    }
  } catch (error) {
    toast.add({
      message: 'Gagal mengubah nama ceklis.',
      error,
    });
  }
};

const updateChecklistItem = async (args: {
  checklistIndex: number;
  itemIndex: number;
  name: string;
  caption?: string;
}): Promise<void> => {
  try {
    const checklist = checklists.value[args.checklistIndex];
    const item = checklist.checklistItems[args.itemIndex];
    const body = { name: args.name, caption: args.caption };
    const { data } = await TaskChecklistServices.updateTaskChecklistItem(
      item._id,
      body,
    );
    if (data) {
      item.showRenameItem = false;
      await getChecklists();
    }
  } catch (error) {
    toast.add({
      message: 'Gagal mengubah nama item ceklis.',
      error,
    });
  }
};

const openConfirmDialog = (args: {
  checklistIndex: number;
  itemIndex: number;
  type: 'deleteItem' | 'uncheckItem';
}): void => {
  const checklist = checklists.value[args.checklistIndex];
  selectedChecklist.value = checklist;
  selectedChecklistItem.value = checklist.checklistItems[args.itemIndex];
  if (args.type === 'deleteItem') {
    dialogDeleteChecklistItem.value = true;
  } else {
    dialogUncheckChecklistItem.value = true;
  }
};

const openAttachmentDialog = (args: {
  checklistIndex: number;
  itemIndex: number;
}): void => {
  const checklist = checklists.value[args.checklistIndex];
  selectedChecklist.value = checklist;
  selectedChecklistItem.value = checklist.checklistItems[args.itemIndex];
  dialogAddAttachment.value = true;
};

/**
 * Toggle checklist item,
 *
 * If value is false, will open confirm dialog before uncheck the item.
 * If toggling is failed, will set checked value back to its previous value.
 * @param {Object} args - Args object
 * @param {number} args.checklistIndex - Index of checklist
 * @param {number} args.itemIndex - Index of item
 * @param {boolean} args.value - Value of checked
 * @param {string} [args.reason] - Reason of uncheck item
 * @returns {Promise<void>}
 */
const toggleChecklistItem = async (args: {
  checklistIndex: number;
  itemIndex: number;
  value: boolean;
  reason?: string;
}): Promise<void> => {
  const { checklistIndex, itemIndex, value, reason } = args;

  if (togglingItem.value) return;

  togglingItem.value = true;
  const checklist = checklists.value[checklistIndex];
  const item = checklist.checklistItems[itemIndex];

  if (args.value === false) {
    item.checked = true;
    item.key++;
    openConfirmDialog({ checklistIndex, itemIndex, type: 'uncheckItem' });
    togglingItem.value = false;
    return;
  }

  try {
    const body: ToggleTaskChecklistItemDTO = {
      checked: value,
      reason: reason ?? '',
    };
    const { data } = await TaskChecklistServices.toggleTaskChecklistItem(
      item._id,
      body,
    );
    if (data) {
      await getChecklists();
    }
    await nextTick();
  } catch (error) {
    // If toggling is failed, set checked value back to its previous value
    item.checked = !value;
    item.key++;
    toast.add({
      message: 'Item ceklis gagal di-check.',
      error,
    });
  } finally {
    togglingItem.value = false;
  }
};

watch(
  taskId,
  (value) => {
    if (value) {
      getChecklists();
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div class="flex flex-col gap-3" data-wv-section="detailtask-task-checklist">
    <DialogAddChecklist
      v-model:visible="dialogAddChecklist"
      @added="getChecklists"
    />
    <DialogSaveChecklistTemplate
      v-model:visible="dialogSaveChecklistTemplate"
      :checklist="selectedChecklist"
    />
    <DialogConfirmChecklist
      v-model:visible="dialogDeleteChecklist"
      :checklist="selectedChecklist"
      @submitted="getChecklists"
      type="deleteList"
    />
    <DialogConfirmChecklist
      v-model:visible="dialogDeleteChecklistItem"
      :checklist="selectedChecklist"
      :item="selectedChecklistItem"
      @submitted="getChecklists"
      type="deleteItem"
    />
    <DialogConfirmChecklist
      v-model:visible="dialogUncheckChecklistItem"
      :checklist="selectedChecklist"
      :item="selectedChecklistItem"
      @submitted="getChecklists"
      type="uncheckItem"
    />
    <DialogDetailChecklistTemplate
      v-model:visible="dialogDetailChecklistTemplate"
    />
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Icon class="w-6 h-6" icon="check" />
        <div class="text-xs font-semibold">Ceklis</div>
      </div>
      <div class="flex items-center gap-2">
        <Button
          class="!p-1"
          icon="file-history"
          icon-class="!w-6 !h-6"
          severity="secondary"
          text
        />
        <Button
          @click="dialogAddChecklist = true"
          icon="add"
          label="Ceklis"
          severity="secondary"
        />
      </div>
    </div>
    <div v-if="checklists?.length" class="pl-8 flex flex-col gap-3">
      <Menu
        ref="moreMenu"
        :model="checklistMenuOptions"
        class="bg-primary-500 !min-w-[170px]"
      />
      <div
        :key="index"
        v-for="(checklist, index) in checklists"
        class="flex flex-col gap-3"
      >
        <template v-if="checklist.showRenameChecklist">
          <InputAdditional
            :validator-message="{
              empty: 'Nama ceklis harus diisi.',
            }"
            :value="checklist.name"
            @cancel="checklist.showRenameChecklist = false"
            @submit="renameChecklist(index, $event)"
            mandatory
            placeholder="Tulis nama ceklis"
          />
        </template>
        <template v-else>
          <div class="flex items-center justify-between">
            <span
              @click="checklist.showRenameChecklist = true"
              class="text-xs font-semibold cursor-pointer"
            >
              {{ checklist.name }}
            </span>
            <div class="flex items-center gap-2">
              <ProgressBar
                v-if="checklist.checklistItems.length"
                :value="
                  (checklist.checklistItems.filter((item) => item.checked)
                    .length /
                    checklist.checklistItems.length) *
                  100
                "
                class="w-[235px]"
                severity="success"
                value-position="left-side"
              />
              <Button
                @click="handleMore($event, checklist)"
                icon="more"
                icon-class="!w-4 !h-4"
                severity="secondary"
                text
              />
            </div>
          </div>
        </template>
        <div
          :key="`${index}-${itemIndex}`"
          v-for="(item, itemIndex) in checklist.checklistItems"
          class="flex flex-col gap-2"
        >
          <template v-if="item.showRenameItem">
            <InputAdditional
              :validator-message="{
                empty: 'Nama item ceklis harus diisi.',
              }"
              :value="item.name"
              @cancel="item.showRenameItem = false"
              @submit="
                updateChecklistItem({
                  checklistIndex: index,
                  itemIndex,
                  name: $event,
                })
              "
              mandatory
              placeholder="Tulis nama item ceklis"
            />
          </template>
          <div v-else class="flex items-center justify-between">
            <div class="flex items-start gap-1 w-2/5">
              <Checkbox
                :key="item.key"
                v-model="item.checked"
                :label="item.name"
                @update:model-value="
                  toggleChecklistItem({
                    checklistIndex: index,
                    itemIndex,
                    value: $event as boolean,
                  })
                "
              />
            </div>
            <div class="flex items-center gap-2">
              <span v-if="item.updatedAt">
                {{ formatDateReadable(new Date(item.updatedAt), 86400) }}
              </span>
              <UserName
                v-if="item.updatedBy"
                :user="item.updatedBy"
                type="icon"
              />
              <Button
                @click="item.showRenameItem = true"
                class="!p-1"
                icon="edit"
                icon-class="!w-6 !h-6"
                severity="secondary"
                text
              />
              <Button
                @click="
                  openAttachmentDialog({ checklistIndex: index, itemIndex })
                "
                class="!p-1"
                icon="attachment-2"
                icon-class="!w-6 !h-6"
                severity="secondary"
                text
              />
              <Button
                @click="item.showCaptionItem = !item.showCaptionItem"
                class="!p-1"
                icon="chat-new-line"
                icon-class="!w-6 !h-6"
                severity="secondary"
                text
              />
              <Button
                class="!p-1"
                icon="chat-1-line"
                icon-class="!w-6 !h-6"
                severity="secondary"
                text
              />
              <Button
                @click="
                  openConfirmDialog({
                    checklistIndex: index,
                    itemIndex: itemIndex,
                    type: 'deleteItem',
                  })
                "
                class="!p-1"
                icon="close"
                icon-class="!w-6 !h-6 !text-danger-500"
                severity="danger"
                text
              />
            </div>
          </div>
          <div v-if="item.showCaptionItem" class="pl-5">
            <InputAdditional
              :validator-message="{
                empty: 'Caption item ceklis harus diisi.',
              }"
              :value="item.caption"
              @cancel="item.showCaptionItem = false"
              @submit="
                updateChecklistItem({
                  checklistIndex: index,
                  itemIndex,
                  name: item.name,
                  caption: $event,
                })
              "
              mandatory
              placeholder="Tulis caption item ceklis"
            />
          </div>
          <span
            v-else-if="item.caption?.length && !item.showCaptionItem"
            class="text-grayscale-700 pl-5 -mt-1"
          >
            {{ item.caption }}
          </span>
          <div v-if="item.attachments?.length" class="pl-5 flex flex-col gap-2">
            <TaskAttachmentItem
              :key="`${index}-${itemIndex}-${attachIndex}`"
              v-for="(attachment, attachIndex) in item.attachments"
              :item="attachment"
              @deleted="getChecklists"
              type="checklist"
            />
          </div>
        </div>
        <div>
          <InputAdditional
            v-if="checklist.showAddItem"
            :validator-message="{
              empty: 'Item ceklis harus diisi.',
            }"
            @cancel="closeInputAddItem(index)"
            @submit="addChecklistItem($event, index)"
            mandatory
            placeholder="Tulis item ceklis"
          />
          <Button
            v-else
            @click="checklist.showAddItem = true"
            icon="add"
            label="Item"
            severity="secondary"
          />
        </div>
      </div>
    </div>
  </div>

  <DialogAddAttachment
    v-model:visible="dialogAddAttachment"
    :object-id="selectedChecklistItem?._id"
    :upload-file-service="TaskChecklistServices.addTaskAttachmentFile"
    :upload-url-service="TaskChecklistServices.addTaskAttachmentUrl"
    @hide="getChecklists"
    type="checklist"
  />
</template>
