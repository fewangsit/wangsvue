<script setup lang="ts">
import { inject, ref } from 'vue';
import {
  LinkTaskIframeEmbed,
  LinkTaskURL,
  TimelineProps,
} from './Timeline.vue.d';
import Timeline from 'primevue/timeline';
import Icon from '../icon/Icon.vue';
import UserName from '../username/UserName.vue';
import TimelineContenByType from './TimelineContenByType.vue';

const Preset = inject('preset')?.timeline;

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
      <div class="flex items-center gap-1 pb-1" data-wv-section="itemheader">
        <h3
          v-html="formatActionTitle(item.action)"
          @click="item.showDetail = !item.showDetail"
          class="leading-5 cursor-pointer truncate !text-xs"
        />
        <UserName
          :user="item.user"
          class="mr-auto"
          type="icon"
          user-name-field="fullName"
        />
        {{ item.date }}
      </div>

      <template v-if="item.showDetail && item.detail">
        <template v-if="'type' in item.detail">
          <TimelineContenByType :detail="item.detail" />
        </template>

        <div
          v-else-if="Object.keys(item.detail ?? {})?.length"
          class="flex flex-col gap-1"
          data-wv-section="itemdetail"
        >
          <template
            :key="key"
            v-for="[key, value] in (() =>
              Object.entries<string | LinkTaskURL | LinkTaskIframeEmbed>(
                item.detail,
              ))()"
          >
            <slot name="detail" v-bind="{ key, value }">
              <div
                v-if="typeof value === 'string'"
                class="grid grid-cols-[max-content,max-content,auto] gap-1 items-start"
              >
                <span class="font-semibold whitespace-nowrap"> {{ key }} </span>
                <span class="font-semibold"> : </span>
                <span class="text-xs">
                  {{ value }}
                </span>
              </div>

              <template v-else-if="'type' in value">
                <div class="grid grid-rows-[max-content,auto] gap-1">
                  <span>
                    <span class="font-semibold whitespace-nowrap">
                      {{ key }}
                    </span>
                    <span class="font-semibold"> : </span>
                  </span>
                  <TimelineContenByType :detail="value" />
                </div>
              </template>
            </slot>
          </template>
        </div>
      </template>
    </template>
  </Timeline>
</template>
