<script setup lang="ts">
import { ref } from 'vue';
import { DetailValue, TimelineProps } from './Timeline.vue.d';
import Timeline from 'primevue/timeline';
import Icon from '../icon/Icon.vue';
import UserName from '../username/UserName.vue';
import Preset from 'lib/preset/timeline';
import Image from '../image/Image.vue';

defineProps<TimelineProps>();

const formatActionTitle = (action: string): string => {
  return action.replace(/`([^`]*)`/g, '<b>$1</b>');
};
</script>

<template>
  <Timeline :value="ref(value).value">
    <template #marker="{ item }">
      <div
        @click="item.showDetail = !item.showDetail"
        v-bind="Preset.marker"
        data-wv-section="timelinemarker"
      >
        <Icon v-bind="Preset.markerArrow(item)" icon="arrow-down" />
      </div>
    </template>

    <template #content="{ item }">
      <div class="flex items-center gap-1" data-wv-section="itemheader">
        <h3 v-html="formatActionTitle(item.action)" class="leading-5" />
        <UserName
          :user="item.user"
          class="mr-auto"
          type="icon"
          user-name-field="fullName"
        />
        {{ item.date }}
      </div>

      <div
        v-if="Object.keys(item.detail ?? {})?.length && item.showDetail"
        class="flex flex-col gap-1 mt-1"
        data-wv-section="itemdetail"
      >
        <template
          :key="key"
          v-for="[key, value] in Object.entries<DetailValue>(item.detail)"
        >
          <slot name="detail" v-bind="{ key, value }">
            <div
              class="grid grid-cols-[max-content,max-content,auto] gap-1 items-start"
            >
              <span class="font-semibold whitespace-nowrap"> {{ key }} </span>
              <span class="font-semibold"> : </span>
              <span v-if="typeof value === 'string'" class="text-xs">
                {{ value }}
              </span>

              <Image
                v-else
                v-once
                :thumbnail="value.path"
                class="!w-10 !h-10"
              />
            </div>
          </slot>
        </template>
      </div>
    </template>
  </Timeline>
</template>
