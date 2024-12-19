<script setup lang="ts">
import { TaskServices } from 'wangsit-api-services';
import { inject, ref, Ref, watch } from 'vue';
import ReviewItem from '../sections/Review/ReviewItem.vue';
import { TaskReview } from 'lib/types/task.type';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import noDataLottie from 'lib/assets/lottie/no-data.lottie';
import { useToast } from 'lib/utils';

const toast = useToast();

const Preset = inject<Record<string, any>>('preset', {}).datatable;

const taskId = inject<Ref<string>>('taskId');

const reviews = ref<TaskReview[]>();

const getTaskReview = async (): Promise<void> => {
  try {
    const { data } = await TaskServices.getTaskReview(taskId.value);
    reviews.value = data.data;
  } catch (error) {
    toast.add({
      message: 'Gagal memuat hasil review task.',
      error,
    });
  }
};

watch(
  taskId,
  (val) => {
    if (val) {
      getTaskReview();
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="flex flex-col gap-4">
    <template v-if="reviews?.length">
      <ReviewItem
        :key="review._id"
        v-for="review in reviews"
        :review="review"
      />
    </template>
    <div v-else v-bind="Preset.nodatalottiewrapper">
      <DotLottieVue
        :src="noDataLottie as string"
        v-bind="Preset.nodatalottie"
        autoplay
        loop
      />
    </div>
  </div>
</template>
