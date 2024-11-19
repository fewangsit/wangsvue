<script setup lang="ts">
import { inject, ref, Ref } from 'vue';
import { useToast } from 'lib/utils';
import Button from 'lib/components/button/Button.vue';
import Dialog from 'lib/components/dialog/Dialog.vue';
import {
  DetailType,
  KeyValue,
  TimelineItem,
} from 'lib/components/timeline/Timeline.vue.d';
import Timeline from 'lib/components/timeline/Timeline.vue';
import TaskChecklistServices from 'lib/services/taskChecklist.service';

const toast = useToast();

interface Attachment {
  type: string;
  src: string;
}

interface DataItem {
  action: string;
  oldValue?: string;
  newValue?: string;
  attachment?: Attachment;
}

type Detail = KeyValue | DetailType;

const visible = defineModel<boolean>('visible', { required: true });

const taskId = inject<Ref<string>>('taskId');

const changelogs = ref<TimelineItem[]>();

const getChecklistChangelog = async (): Promise<void> => {
  try {
    const { data } = await TaskChecklistServices.getTaskChecklistChangelog(
      taskId.value,
    );

    changelogs.value = data.data.map((d) => {
      return {
        ...d,
        detail: getDetail(d),
      };
    });
  } catch (error) {
    toast.add({
      error,
      message: 'Changelog gagal dimuat.',
    });
  }
};

const getDetail = (d: DataItem): Detail => {
  if (d.action.toLowerCase().includes('edit')) {
    return {
      Sebelum: d.oldValue,
      Sesudah: d.newValue,
    };
  }

  if (d.attachment) {
    return {
      type: ['mkv', 'mp4'].includes(d.attachment.type)
        ? 'video'
        : d.attachment.type,
      filePath: d.attachment.src,
      url: d.attachment.src,
    };
  }

  return {
    type: 'text',
    value: d.newValue,
  };
};
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :closable="false"
    @show="getChecklistChangelog"
    class="w-[600px]"
    header="Changelog Ceklis"
    modal
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <span class="text-lg font-semibold leading-4"> Changelog Ceklis </span>
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
    <Timeline :value="changelogs" />
  </Dialog>
</template>
