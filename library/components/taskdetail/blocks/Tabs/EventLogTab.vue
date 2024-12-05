<script setup lang="ts">
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import noDataLottie from 'lib/assets/lottie/no-data.lottie';
import Timeline from 'lib/components/timeline/Timeline.vue';
import { TimelineItem } from 'lib/components/timeline/Timeline.vue.d';
import LogServices from 'lib/services/log.service';
import { useToast } from 'lib/utils';
import { formatDate } from 'lib/utils/date.util';
import { watch, inject, Ref, ref } from 'vue';

const toast = useToast();

const Preset = inject<Record<string, any>>('preset', {}).datatable;
const taskId = inject<Ref<string>>('taskId');

const eventLogs = ref<TimelineItem[]>();

const getEventLog = async (): Promise<void> => {
  try {
    const { data } = await LogServices.getEventLog({
      object: 'Task',
      objectId: taskId.value,
    });
    eventLogs.value = data.data.map((d) => ({
      ...d,
      createdAt: formatDate(new Date(d.createdAt)),
    }));
  } catch (error) {
    toast.add({
      error,
      message: 'Event Log gagal dimuat.',
    });
  }
};

watch(
  taskId,
  (val) => {
    if (val) {
      getEventLog();
    }
  },
  { immediate: true },
);
</script>

<template>
  <Timeline v-if="eventLogs?.length" :value="eventLogs" no-format-date />
  <div v-else v-bind="Preset.nodatalottiewrapper">
    <DotLottieVue
      :src="noDataLottie as string"
      v-bind="Preset.nodatalottie"
      autoplay
      loop
    />
  </div>
</template>
