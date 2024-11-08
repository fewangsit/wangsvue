<script setup lang="ts">
import { computed, inject, ref, Ref, watch } from 'vue';
import Button from 'lib/components/button/Button.vue';
import Dialog from 'lib/components/dialog/Dialog.vue';
import { TaskChecklist, TaskDetailData } from 'lib/types/task.type';
import TaskChecklistServices from 'lib/services/taskChecklist.service';
import { useToast } from 'lib/utils';
import TaskAttachmentItem from '../Attachment/AttachmentItem.vue';
import Checkbox from 'lib/components/checkbox/Checkbox.vue';
import ButtonRadio from 'lib/components/buttonradio/ButtonRadio.vue';
import Editor from 'lib/components/editor/Editor.vue';
import TaskServices from 'lib/services/task.service';
import { ReviewTaskDTO } from 'lib/dto/task.dto';
import DialogConfirm from 'lib/components/dialogconfirm/DialogConfirm.vue';
import Checklist from '../Checklist/Checklist.vue';

type ReviewTaskChecklist = TaskChecklist & {
  checked: boolean;
  isRequested: boolean;
  checkedAt?: string;
  caption?: string;
  attachments?: any[];
  checklistId: string;
  checklistName: string;
  key: number;
  result?: 'Ok' | 'Bug';
  content?: string;
};

const toast = useToast();

const visible = defineModel<boolean>('visible', { required: true });

const emit = defineEmits<{
  saved: [];
}>();

const taskDetail = inject<Ref<TaskDetailData>>('taskDetail');
const taskId = inject<Ref<string>>('taskId');

const checklistItems = ref<ReviewTaskChecklist[]>();
const activeIndex = ref<number>(0);
const confirmReview = ref(false);

const newChecklists = ref<TaskChecklist[]>();

const lastItem = computed(() =>
  checklistItems.value?.length
    ? activeIndex.value === checklistItems.value?.length - 1
    : false,
);

const anyBugs = computed(() =>
  checklistItems.value?.some((item) => item.result === 'Bug'),
);

const getChecklists = async (): Promise<void> => {
  try {
    const { data } = await TaskChecklistServices.getTaskChecklists(
      taskId.value,
    );
    if (data) {
      checklistItems.value = data.data.flatMap(
        (checklist: ReviewTaskChecklist) =>
          checklist.checklistItems.map((item) => ({
            ...item,
            checklistId: checklist._id,
            checklistName: checklist.name,
            key: 0,
            result: undefined,
            content: undefined,
          })),
      );
    }
  } catch (error) {
    toast.add({
      message: 'Gagal memuat data ceklis.',
      error,
    });
  }
};

const reviewTask = async (): Promise<void> => {
  try {
    const payload: ReviewTaskDTO = {
      data: checklistItems.value.map((item) => ({
        checklistId: item.checklistId,
        checklistName: item.checklistName,
        checklistItemName: item.name,
        result: item.result,
        content: JSON.stringify(item.content),
      })),
      checklists:
        newChecklists.value?.map((checklist) => ({
          checklistName: checklist.name,
          checklistItems: checklist.checklistItems.map((checklistItem) => ({
            checklistItemName: checklistItem.name,
            content: checklistItem.content
              ? JSON.stringify(checklistItem.content)
              : undefined,
          })),
        })) ?? [],
    };
    const { data } = await TaskServices.reviewTask(taskId.value, payload);
    if (data) {
      toast.add({
        message: 'Task telah direview.',
        severity: 'success',
      });
      emit('saved');
      visible.value = false;
    }
  } catch (error) {
    toast.add({
      message: 'Task gagal direview.',
      error,
    });
  }
};

const updateChecklist = (checklists: TaskChecklist[]): void => {
  newChecklists.value = checklists;
};

watch(visible, (value) => {
  activeIndex.value = 0;
  if (value) {
    getChecklists();
  }
});
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :closable="false"
    class="w-[800px]"
    header="Review Leader"
    modal
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <span class="text-lg font-semibold leading-4">Review Leader</span>
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
    </template>
    <div class="flex flex-col gap-3">
      <div class="flex flex-col gap-2">
        <div class="grid grid-cols-[90px,auto,1fr] gap-3">
          <span class="font-semibold">Proses</span>
          <span>:</span>
          <span>{{ taskDetail?.process?.name }}</span>
        </div>
        <div class="grid grid-cols-[90px,auto,1fr] gap-3">
          <span class="font-semibold">Modul</span>
          <span>:</span>
          <span>{{ taskDetail?.module?.name }}</span>
        </div>
        <div
          v-if="taskDetail?.subModule"
          class="grid grid-cols-[90px,auto,1fr] gap-3"
        >
          <span class="font-semibold">Sub Modul</span>
          <span>:</span>
          <span>{{ taskDetail?.subModule?.name }}</span>
        </div>
        <div class="grid grid-cols-[90px,auto,1fr] gap-3">
          <span class="font-semibold">Nama Task</span>
          <span>:</span>
          <span>{{ taskDetail?.name }}</span>
        </div>
      </div>

      <div
        :key="index"
        v-show="activeIndex === index"
        v-for="(checklistItem, index) in checklistItems"
        class="flex flex-col gap-3"
      >
        <span class="text-xs font-semibold">
          {{ checklistItem.checklistName }}
        </span>
        <div class="flex flex-col gap-2">
          <Checkbox
            :key="checklistItem.key"
            v-model="checklistItem.checked"
            :label="checklistItem.name"
            disabled
          />
          <div class="pl-5 flex flex-col gap-2">
            <span
              v-if="checklistItem.caption?.length"
              class="text-grayscale-700 -mt-1"
            >
              {{ checklistItem.caption }}
            </span>
            <div
              v-if="checklistItem.attachments?.length"
              class="flex flex-col gap-2"
            >
              <TaskAttachmentItem
                :key="`${index}-${attachIndex}`"
                v-for="(attachment, attachIndex) in checklistItem.attachments"
                :item="attachment"
                readonly
                type="checklist"
              />
            </div>
          </div>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-1">
              <span>Hasil:</span>
              <ButtonRadio
                v-model="checklistItem.result"
                label="OK"
                value="Ok"
              />
              <ButtonRadio
                v-model="checklistItem.result"
                label="Bug"
                value="Bug"
              >
                <template #label>
                  <span class="text-danger-500">Bug</span>
                </template>
              </ButtonRadio>
            </div>
            <Editor
              v-if="checklistItem.result === 'Bug'"
              v-model="checklistItem.content"
              editor-state="editable"
              is-image-upload-base64
              placeholder="Tulis keterangan hasil review disini"
            />
          </div>
        </div>
      </div>

      <div v-if="lastItem" class="pt-6">
        <Checklist :static="true" @updated="updateChecklist" />
      </div>

      <div v-if="checklistItems?.length" class="flex flex-col gap-2 pt-4">
        <div class="flex justify-between">
          <span :class="{ invisible: activeIndex === 0 }">
            Sebelumnya: {{ checklistItems[activeIndex - 1]?.name }}
          </span>
          <span :class="{ invisible: lastItem }">
            Selanjutnya: {{ checklistItems[activeIndex + 1]?.name }}
          </span>
        </div>

        <div class="flex justify-between items-center">
          <div class="w-[116px]">
            <Button
              v-if="activeIndex > 0"
              @click="activeIndex--"
              label="< Sebelumnya"
              severity="secondary"
            />
          </div>
          <span>{{
            `${activeIndex + 1} dari ${checklistItems.length} ceklis`
          }}</span>
          <div class="w-[116px] flex justify-end">
            <Button
              v-if="lastItem"
              :disabled="!checklistItems[activeIndex]?.result"
              @click="confirmReview = true"
              label="Selesai Review"
              severity="success"
            />
            <Button
              v-else
              :disabled="!checklistItems[activeIndex]?.result"
              @click="activeIndex++"
              class=""
              label="Selanjutnya >"
              severity="secondary"
            />
          </div>
        </div>
      </div>
    </div>
  </Dialog>

  <DialogConfirm
    v-model:visible="confirmReview"
    :confirm-label="anyBugs ? 'Lanjutkan' : 'Simpan'"
    :header="anyBugs ? 'Bug Review' : 'Selesai Review'"
    :message="
      anyBugs
        ? 'Task akan ditandai fixing bug, Apakah kamu yakin ingin melanjutkannya?'
        : 'Task akan ditandai selesai, Apakah kamu yakin ingin menyimpan hasil review ini?'
    "
    :severity="anyBugs ? 'danger' : 'success'"
    @confirm="reviewTask"
  />
</template>
