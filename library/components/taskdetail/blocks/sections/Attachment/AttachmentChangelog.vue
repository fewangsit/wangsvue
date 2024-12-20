<script setup lang="ts">
import { inject, ref, Ref } from 'vue';
import Button from 'lib/components/button/Button.vue';
import Dialog from 'lib/components/dialog/Dialog.vue';
import { useToast } from 'lib/utils';
import { TaskAttachmentServices } from 'wangsit-api-services';
import { TimelineItem } from 'lib/components/timeline/Timeline.vue.d';
import Timeline from 'lib/components/timeline/Timeline.vue';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import noDataLottie from 'lib/assets/lottie/no-data.lottie';

const toast = useToast();

const visible = defineModel<boolean>('visible', { required: true });

const taskId = inject<Ref<string>>('taskId');

const Preset = inject<Record<string, any>>('preset', {}).datatable;

const changelogs = ref<TimelineItem[]>();

const getChangelog = async (): Promise<void> => {
  try {
    const { data } = await TaskAttachmentServices.getTaskAttachmentChangelog(
      taskId.value,
    );
    changelogs.value = data.data.map((d) => ({
      ...d,
      detail: {
        type: ['mkv', 'mp4'].includes(d.type) ? 'video' : d.type,
        filePath: d.attachmentSrc,
        url: d.attachmentSrc,
      },
    }));
  } catch (error) {
    toast.add({
      error,
      message: 'Changelog gagal dimuat.',
    });
  }
};
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :closable="false"
    @show="getChangelog"
    class="w-[600px]"
    header="Changelog Attachment"
    modal
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <span class="text-lg font-semibold leading-4">
          Changelog Attachment
        </span>
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
    <Timeline v-if="changelogs?.length" :value="changelogs" />
    <div v-else v-bind="Preset.nodatalottiewrapper">
      <DotLottieVue
        :src="noDataLottie as string"
        v-bind="Preset.nodatalottie"
        autoplay
        loop
      />
    </div>
  </Dialog>
</template>
