<script setup lang="ts">
import {
  computed,
  ComputedRef,
  inject,
  nextTick,
  Ref,
  ref,
  shallowRef,
  watch,
} from 'vue';
import Icon from 'lib/components/icon/Icon.vue';
import Button from 'lib/components/button/Button.vue';
import Menu from 'lib/components/menu/Menu.vue';
import { MenuItem } from 'lib/components/menuitem';
import { useToast } from 'lib/utils';
import Checkbox from 'lib/components/checkbox/Checkbox.vue';
import UserName from 'lib/components/username/UserName.vue';
import ProgressBar from 'lib/components/progressbar/ProgressBar.vue';
import TaskChecklistServices from 'lib/services/taskChecklist.service';
import {
  TaskChecklist,
  TaskChecklistItem,
  TaskDetailData,
} from 'lib/types/task.type';
import {
  AddTaskChecklistItemDTO,
  ToggleTaskChecklistItemDTO,
} from 'lib/dto/taskChecklist.dto';
import { formatDateReadable } from 'lib/utils/date.util';
import DialogAddAttachment from '../../common/DialogAddAttachment.vue';
import InputAdditional from '../../common/InputAdditional.vue';
import TaskAttachmentItem from '../Attachment/AttachmentItem.vue';
import DialogConfirmChecklist from './DialogConfirmChecklist.vue';
import DialogSaveChecklistTemplate from './DialogSaveChecklistTemplate.vue';
import DialogDetailChecklistTemplate from './DialogDetailChecklistTemplate.vue';
import DialogAddChecklist, {
  AddTaskChecklistStaticDTO,
} from './DialogAddChecklist.vue';
import { AxiosResponse } from 'axios';
import Editor from 'lib/components/editor/Editor.vue';
import ChecklistChangelog from './ChecklistChangelog.vue';
import { WangsitStatus } from 'lib/types/wangsStatus.type';

const toast = useToast();

const props = defineProps<{
  static?: boolean;
}>();

const emit = defineEmits<{
  updated: [checklists: TaskChecklist[]];
}>();

const userType =
  inject<ComputedRef<'member' | 'admin' | 'pm' | 'teamLeader' | 'guest'>>(
    'userType',
  );
const taskId = inject<Ref<string>>('taskId');
const taskDetail = inject<Ref<TaskDetailData>>('taskDetail');
const updateMentionSectionText = inject<(sectionTitle: string) => void>(
  'updateMentionSectionText',
);
const isApproverHasAccess = inject<Ref<boolean>>('isApproverHasAccess');

const checklists = ref<TaskChecklist[]>(props.static ? [] : undefined);

const dialogAddChecklist = shallowRef<boolean>(false);
const dialogSaveChecklistTemplate = shallowRef<boolean>(false);
const dialogDetailChecklistTemplate = shallowRef<boolean>(false);
const dialogDeleteChecklist = shallowRef<boolean>(false);
const dialogDeleteChecklistItem = shallowRef<boolean>(false);
const dialogUncheckChecklistItem = shallowRef<boolean>(false);
const dialogAddAttachment = shallowRef<boolean>(false);
const dialogChangelog = shallowRef<boolean>(false);

const selectedChecklist = ref<TaskChecklist>();
const selectedChecklistItem = ref<TaskChecklistItem>();
const moreMenu = ref();

const togglingItem = shallowRef<boolean>(false);

const isDisabled = computed(() => {
  if (props.static) return false;
  const disabledStatus = (
    ['Selesai', 'Reported Bug', 'Pending Review Leader'] as WangsitStatus[]
  ).includes(taskDetail.value?.status);

  return (
    disabledStatus || (userType.value === 'guest' && !isApproverHasAccess.value)
  );
});

const getMenuOptions = (disabled: boolean): MenuItem[] => {
  return disabled || selectedChecklist.value?.isRequested
    ? []
    : [
        {
          icon: 'save',
          label: 'Simpan Template',
          command: (): void => {
            dialogSaveChecklistTemplate.value = true;
          },
          visible: !props.static,
        },
        {
          icon: 'file-copy-2-line',
          label: 'Detail Template',
          command: (): void => {
            dialogDetailChecklistTemplate.value = true;
          },
          visible: !props.static,
        },
        {
          icon: 'delete-bin',
          label: 'Hapus Ceklis',
          danger: true,
          command: (): void => {
            if (props.static) {
              const checklistIndex = checklists.value.findIndex(
                (checklist) => checklist._id === selectedChecklist.value._id,
              );
              deleteStaticChecklist(checklistIndex);
            } else {
              dialogDeleteChecklist.value = true;
            }
          },
          visible: true,
        },
      ];
};

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
    let response: boolean | AxiosResponse<any, any>;
    if (props.static) {
      checklists.value[index].checklistItems.push({
        _id: (Math.random() + 1).toString(36).substring(2),
        name: item,
        checked: false,
        isRequested: false,
        createdAt: '-',
        updatedAt: '-',
        attachments: [],
      });
      response = true;
    } else {
      response = await TaskChecklistServices.addTaskChecklistItem(body);
    }
    if (response) {
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
  if (props.static) {
    emit('updated', checklists.value);
    return;
  }
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
    let response: boolean | AxiosResponse<any, any>;
    if (props.static) {
      checklist.name = name;
      response = true;
    } else {
      response = await TaskChecklistServices.updateTaskChecklist(
        checklist._id,
        {
          name,
        },
      );
    }
    if (response) {
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
  if (isDisabled.value) return;
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

const addStaticChecklist = (staticBody: AddTaskChecklistStaticDTO): void => {
  const body: TaskChecklist = {
    name: staticBody.name,
    task: taskId.value,
    _id: (Math.random() + 1).toString(36).substring(2),
    checklistItems:
      staticBody.template?.map((item) => ({
        name: item,
        _id: (Math.random() + 1).toString(36).substring(2),
        checked: false,
        isRequested: false,
        createdAt: '-',
        updatedAt: '-',
        attachments: [],
      })) ?? [],
  };
  checklists.value?.push(body);
};

const deleteStaticChecklist = (
  checklistIndex: number,
  itemIndex?: number,
): void => {
  if (typeof itemIndex === 'number') {
    const checklist = checklists.value[checklistIndex];
    checklist.checklistItems.splice(itemIndex, 1);
  } else {
    checklists.value.splice(checklistIndex, 1);
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

<!-- eslint-disable vue/html-indent -->
<template>
  <div class="flex flex-col gap-3" data-wv-section="detailtask-task-checklist">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Icon class="w-6 h-6" icon="check" />
        <div class="flex">
          <span class="text-xs font-semibold">Ceklis</span>
          <Icon
            v-if="props.static"
            class="w-2.5 h-2.5"
            icon="info"
            info="Leader bisa menambahkan ceklisan baru apabila menemukan bug diluar dari ceklisan yang ada."
            tooltip-pos="top"
          />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Button
          v-if="!props.static"
          @click="dialogChangelog = true"
          class="!p-1"
          icon="file-history"
          icon-class="!w-6 !h-6"
          severity="secondary"
          text
        />
        <Button
          :disabled="isDisabled"
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
        :model="getMenuOptions(isDisabled)"
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
              @click="
                () => {
                  if (isDisabled || checklist.isRequested) {
                    return;
                  }
                  checklist.showRenameChecklist = true;
                }
              "
              class="text-xs font-semibold cursor-pointer"
            >
              {{ checklist.name }}
            </span>
            <div class="flex items-center gap-2">
              <ProgressBar
                v-if="checklist.checklistItems.length && !props.static"
                :value="
                  Math.round(
                    (checklist.checklistItems.filter((item) => item.checked)
                      .length /
                      checklist.checklistItems.length) *
                      100,
                  )
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
                :disabled="
                  props.static ||
                  isDisabled ||
                  item.isRequested ||
                  checklist.isRequested
                "
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
              <template v-if="!props.static">
                <span v-if="item.updatedAt">
                  {{ formatDateReadable(new Date(item.updatedAt), 86400) }}
                </span>
                <UserName
                  v-if="item.updatedBy"
                  :user="item.updatedBy"
                  type="icon"
                />
                <Button
                  :disabled="
                    isDisabled || item.isRequested || checklist.isRequested
                  "
                  @click="item.showRenameItem = true"
                  class="!p-1"
                  icon="edit"
                  icon-class="!w-6 !h-6"
                  severity="secondary"
                  text
                />
                <Button
                  :disabled="
                    isDisabled || item.isRequested || checklist.isRequested
                  "
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
                  :disabled="
                    isDisabled || item.isRequested || checklist.isRequested
                  "
                  @click="item.showCaptionItem = !item.showCaptionItem"
                  class="!p-1"
                  icon="chat-new-line"
                  icon-class="!w-6 !h-6"
                  severity="secondary"
                  text
                />
                <Button
                  @click="updateMentionSectionText(item.name)"
                  class="!p-1"
                  icon="chat-1-line"
                  icon-class="!w-6 !h-6"
                  severity="secondary"
                  text
                />
              </template>
              <Button
                :disabled="
                  isDisabled || item.isRequested || checklist.isRequested
                "
                @click="
                  props.static
                    ? deleteStaticChecklist(index, itemIndex)
                    : openConfirmDialog({
                        checklistIndex: index,
                        itemIndex: itemIndex,
                        type: 'deleteItem',
                      })
                "
                class="!p-1"
                icon="close"
                icon-class="!w-6 !h-6"
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
              :disabled="
                isDisabled || item.isRequested || checklist.isRequested
              "
              :item="attachment"
              @deleted="getChecklists"
              type="checklist"
            />
          </div>
          <div v-if="props.static" class="px-5 flex flex-col gap-2">
            <span class="text-danger-500">Keterangan Bug</span>
            <Editor
              v-model="item.content"
              @update:model-value="emit('updated', checklists)"
              editor-state="editable"
              is-image-upload-base64
              placeholder="Tulis keterangan bug disini"
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
            :disabled="isDisabled || checklist.isRequested"
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

  <DialogAddChecklist
    v-model:visible="dialogAddChecklist"
    :static="props.static"
    @add="addStaticChecklist"
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

  <ChecklistChangelog v-model:visible="dialogChangelog" />
</template>
