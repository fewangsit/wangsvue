<script setup lang="ts">
import Editor from 'lib/components/editor/Editor.vue';
import UserName from 'lib/components/username/UserName.vue';
import { TaskReview } from 'lib/types/task.type';
import { formatDateReadable } from 'lib/utils/date.util';

const props = defineProps<{
  review: TaskReview;
}>();
</script>

<template>
  <div class="w-full">
    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-1">
          <span class="font-semibold">{{ props.review.title }}</span>
          <UserName :user="props.review.user" type="icon" />
        </div>
        <span>{{
          formatDateReadable(new Date(props.review.createdAt), 86400)
        }}</span>
      </div>
      <div
        :key="index"
        v-for="(checklist, index) in props.review.checklists"
        class="flex flex-col gap-3"
      >
        <span class="font-semibold">{{ checklist.name }}</span>
        <div
          :key="itemIndex"
          v-for="(item, itemIndex) in checklist.items"
          class="pl-5 flex flex-col gap-2"
        >
          <div class="flex flex-col gap-2">
            <div class="grid grid-cols-[40px,auto,1fr] gap-3">
              <span class="font-semibold">Ceklis</span>
              <span>:</span>
              <span>{{ item.name }}</span>
            </div>
            <div class="grid grid-cols-[40px,auto,1fr] gap-3">
              <span class="font-semibold">Hasil</span>
              <span>:</span>
              <span :class="{ 'text-danger-500': item.result === 'Bug' }">{{
                item.result
              }}</span>
            </div>
          </div>
          <Editor
            v-if="item.content"
            :model-value="JSON.parse(item.content)"
            editor-state="readonly"
          />
        </div>
      </div>
    </div>
  </div>
</template>
