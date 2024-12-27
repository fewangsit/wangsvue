<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { DialogDetailPbiProps } from './DialogDetailPbi.vue.d';
import { TimelineItem } from '../timeline/Timeline.vue.d';
import { JSONContent } from '../editor/Editor.vue.d';
import { MenuItem } from '../menuitem';
import {
  convertJsonImage,
  getUser,
  getProjectPermission,
  getImageURL,
} from 'lib/utils';
import { User } from 'lib/types/user.type';
import TaskDetailPbi from './TaskDetailPbi.vue';
import Dialog from '../dialog/Dialog.vue';
import TabMenu from '../tabmenu/TabMenu.vue';
import Badge from '../badge/Badge.vue';
import UserName from '../username/UserName.vue';
import Editor from '../editor/Editor.vue';
import Timeline from '../timeline/Timeline.vue';
import Comment from '../comment/Comment.vue';
import { AuditServices } from 'wangsit-api-services';

const props = withDefaults(defineProps<DialogDetailPbiProps>(), {
  editable: true,
  isQc: false,
});

const visible = defineModel<boolean>('visible', { required: true });
const activeTab = shallowRef<number>();
const eventLogItems = shallowRef<TimelineItem[]>([]);

const pbiDescription = computed<JSONContent | undefined>(() => {
  if (props.selectedPbi?.description) {
    return convertJsonImage(props.selectedPbi.description);
  }
  return undefined;
});

const menu = computed<MenuItem[]>(() => [
  { label: 'Deskripsi' },
  { label: 'Task', visible: !props.isQc },
  { label: 'Event Log', visible: !props.isQc },
  { label: 'Komentar' },
]);

const printItems = computed<
  {
    printKey: string;
    printValue:
      | { value: string; type?: 'badge' }
      | { user: Partial<User> | undefined; date: string; type: 'user' };
  }[][]
>(() => {
  return [
    [
      {
        printKey: 'Judul PBI',
        printValue: { value: props.selectedPbi?.name ?? '-' },
      },
      {
        printKey: 'Status',
        printValue: { value: props.selectedPbi?.status ?? '-', type: 'badge' },
      },
      {
        printKey: 'Durasi Pengerjaan',
        printValue: {
          value: props.selectedPbi?.duration ?? '-',
        },
      },
      {
        printKey: 'Diubah Oleh',
        printValue: {
          user: props.selectedPbi?.editedBy,
          date: props.selectedPbi?.lastModified ?? '-',
          type: 'user',
        },
      },
    ],
    [
      {
        printKey: 'Kategori',
        printValue: { value: props.selectedPbi?.category ?? '-' },
      },
      {
        printKey: 'Estimasi Pengerjaan',
        printValue: {
          value:
            props.selectedPbi?.estimateDuration === '00h 00j 00m'
              ? '-'
              : (props.selectedPbi?.estimateDuration ?? '-'),
        },
      },
      {
        printKey: 'Iterasi',
        printValue: {
          value: props.selectedPbi?.iteration
            ? `${props.selectedPbi?.iteration} Kali`
            : '-',
        },
      },
    ],
  ];
});

const showDialog = (): void => {
  activeTab.value = 0;
};

const getEventLog = async (): Promise<void> => {
  try {
    const { data } = await AuditServices.getEventLog({
      object: 'Product Backlog Item',
      objectId: props.selectedPbi?._id,
    });
    eventLogItems.value = data.data;
  } catch (error) {
    console.error(error);
  }
};
</script>

<!-- eslint-disable vue/html-indent -->
<template>
  <Dialog
    v-model:visible="visible"
    @show="showDialog"
    class="w-[800px]"
    header="Detail Product Backlog Item"
  >
    <TabMenu
      v-if="
        selectedPbi?.isMemberAssigned ||
        selectedPbi?.createdBy._id === getUser()._id ||
        getProjectPermission(project, selectedPbi?.createdBy.teams).read
      "
      v-model:active-index="activeTab"
      :menu="menu"
      @update:active-index="if ($event === 2) getEventLog();"
    />
    <template v-if="activeTab === 0">
      <div class="grid grid-flow-col justify-stretch gap-3">
        <div
          :key="`print${index}`"
          v-for="(prints, index) in printItems"
          class="flex flex-col gap-2"
        >
          <div :key="print.printKey" v-for="print in prints" class="flex">
            <span class="content-center h-6 min-w-[125px]">
              {{ print.printKey }}
            </span>
            <span class="content-center">:&nbsp;</span>
            <template v-if="print.printValue.type === 'badge'">
              <Badge
                v-if="print.printValue"
                :label="print.printValue.value"
                format="nowrap"
              />
              <span v-else class="content-center"> - </span>
            </template>
            <template v-else-if="print.printValue.type === 'user'">
              <UserName
                :user="print.printValue.user"
                class="mr-1"
                type="icon"
              />
              <span class="content-center">{{ print.printValue.date }}</span>
            </template>
            <template v-else>
              <span class="content-center text-wrap">{{
                print.printValue['value']
              }}</span>
            </template>
          </div>
        </div>
      </div>
      <div class="flex">
        <span class="content-center h-6 min-w-[125px]"> Deskripsi PBI </span>
        <span class="content-center">:&nbsp;</span>
      </div>
      <Editor
        :initial-value="pbiDescription"
        editor-state="readonly"
        editor-wrapper-class="!border-0"
      />
    </template>
    <TaskDetailPbi v-else-if="activeTab === 1" v-bind="$props" />
    <Timeline
      v-else-if="activeTab === 2"
      :align-detail="true"
      :value="eventLogItems"
      class="h-[400px]"
    />
    <div v-else-if="activeTab === 3" class="overflow-auto h-[400px]">
      <Comment
        :object-id="selectedPbi?._id"
        :user="{
          _id: getUser()._id,
          name: getUser().nickName,
          profilePicture: getImageURL(getUser().profilePictureBig) as string,
        }"
        comment-type="pbi"
      />
    </div>
  </Dialog>
</template>
