<script setup lang="ts">
import { inject, ref } from 'vue';
import { DetailType, TimelineProps } from './Timeline.vue.d';
import { formatISODate } from 'lib/utils';
import Timeline from 'primevue/timeline';
import Icon from '../icon/Icon.vue';
import UserName from '../username/UserName.vue';
import TimelineContentByType from './TimelineContentByType.vue';

const Preset = inject<Record<string, any>>('preset', {}).timeline;

defineProps<TimelineProps>();

const formatActionTitle = (action: string): string => {
  return action.replace(/`([^`]*)`/g, '<b>$1</b>');
};
</script>

<template>
  <Timeline
    :class="[{ 'overflow-auto': !noScroll }]"
    :value="ref(value).value"
    style="scrollbar-width: none"
  >
    <template #marker="{ item }">
      <div
        @click="item.showDetail = !item.showDetail"
        v-bind="Preset?.marker"
        data-wv-section="timelinemarker"
      >
        <Icon v-bind="Preset?.markerArrow(item)" icon="arrow-down" />
      </div>
    </template>

    <template #content="{ item }">
      <div class="flex justify-between items-center">
        <div class="flex gap-1 py-0.5" data-wv-section="itemheader">
          <h3
            v-html="formatActionTitle(item.action)"
            @click="item.showDetail = !item.showDetail"
            class="leading-5 cursor-pointer truncate !text-xs"
          />
          <UserName
            v-if="item.user"
            :user="item.user"
            type="icon"
            user-name-field="nickName"
          />
        </div>
        {{ noFormatDate ? item.createdAt : formatISODate(item.createdAt) }}
      </div>

      <template v-if="item.showDetail && item.detail">
        <template v-if="'type' in item.detail">
          <TimelineContentByType :detail="item.detail" />
        </template>

        <div
          v-else-if="Object.keys(item.detail ?? {})?.length"
          class="flex flex-col gap-1"
          data-wv-section="itemdetail"
        >
          <div
            v-if="$props.alignDetail"
            class="grid grid-cols-[max-content,max-content,auto] gap-2 py-1.5 items-start"
          >
            <template
              :key="key"
              v-for="[key, value] in (() =>
                Object.entries<string | DetailType>(item.detail))()"
            >
              <span class="font-semibold whitespace-nowrap"> {{ key }} </span>
              <span class="font-semibold whitespace-nowrap"> : </span>
              <span v-if="typeof value === 'string'" class="text-xs">
                {{ value }}
              </span>
              <TimelineContentByType
                v-else-if="'type' in value"
                :detail="value"
              />
            </template>
          </div>
          <template
            :key="key"
            v-else
            v-for="[key, value] in (() =>
              Object.entries<string | DetailType>(item.detail))()"
          >
            <slot name="detail" v-bind="{ key, value }">
              <div
                v-if="typeof value === 'string'"
                class="grid grid-cols-[max-content,max-content,auto] gap-1 items-start"
              >
                <span class="font-semibold whitespace-nowrap">
                  {{ key }}:
                </span>
                <span class="text-xs">
                  {{ value }}
                </span>
              </div>

              <template v-else-if="'type' in value">
                <div class="grid grid-rows-[max-content,auto] gap-1">
                  <span
                    :class="[
                      'flex gap-1',
                      { 'flex-col': value.type === 'embed' },
                    ]"
                  >
                    <span class="font-semibold whitespace-nowrap">
                      {{ key }}:
                    </span>
                    <TimelineContentByType
                      v-if="value.type !== 'json'"
                      :detail="value"
                    />
                  </span>
                  <TimelineContentByType
                    v-if="value.type === 'json'"
                    :detail="value"
                  />
                </div>
              </template>
            </slot>
          </template>
        </div>
      </template>
    </template>
  </Timeline>
</template>
