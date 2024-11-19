<script setup lang="ts">
import { inject, ref, Ref } from 'vue';
import { useToast } from 'lib/utils';
import TaskLinkServices from 'lib/services/taskLink.service';
import { TaskLinkType } from 'lib/types/task.type';
import Button from 'lib/components/button/Button.vue';
import Dialog from 'lib/components/dialog/Dialog.vue';
import { TimelineItem } from 'lib/components/timeline/Timeline.vue.d';
import Timeline from 'lib/components/timeline/Timeline.vue';

const toast = useToast();

const visible = defineModel<boolean>('visible', { required: true });

const props = defineProps<{
  type: TaskLinkType;
}>();

const taskId = inject<Ref<string>>('taskId');

const changelogs = ref<TimelineItem[]>();

const getLinkChangelog = async (): Promise<void> => {
  try {
    const { data } = await TaskLinkServices.getTaskLinkChangelog(
      taskId.value,
      props.type,
    );
    changelogs.value = data.data.map((d) => ({
      ...d,
      detail: d.action.toLowerCase().includes('edit')
        ? {
            Sebelum: {
              type: d.oldValue.type === 'embedded' ? 'embed' : 'taskUrl',
              url: d.oldValue.link,
              code: d.oldValue.link,
            },
            Sesudah: {
              type: d.newValue.type === 'embedded' ? 'embed' : 'taskUrl',
              url: d.newValue.link,
              code: d.newValue.link,
            },
          }
        : {
            type: d.newValue.type === 'embedded' ? 'embed' : 'taskUrl',
            url: d.newValue.link,
            code: d.newValue.link,
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
    @show="getLinkChangelog"
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
    <Timeline :value="changelogs" />
  </Dialog>
</template>
