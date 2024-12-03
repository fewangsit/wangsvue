<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import ButtonToggle from 'lib/components/buttontoggle/ButtonToggle.vue';
import { shallowRef } from 'vue';

const trueFirst = shallowRef<boolean>(true);
const trueFirstDisabled = shallowRef<boolean>(true);
const falseFirst = shallowRef<boolean>(false);
const falseFirstDisabled = shallowRef<boolean>(false);

const trueTriState = shallowRef<boolean>(true);
const falseTriState = shallowRef<boolean>(false);
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Toggle" />
    </template>
    <template #content>
      <div
        class="w-[111px] flex flex-col gap-3 h-auto p-4 relative bg-white rounded-[5px] border-2 border-dashed border-[#9747ff]"
      >
        <div class="flex flex-col gap-2">
          <div class="flex gap-1">
            <ButtonToggle v-model="trueFirst" />
            <span>Label</span>
          </div>
          <div class="flex gap-1">
            <ButtonToggle v-model="trueFirstDisabled" disabled />
            <span>Label</span>
          </div>
          <div class="flex gap-1">
            <ButtonToggle v-model="falseFirst" />
            <span>Label</span>
          </div>
          <div class="flex gap-1">
            <ButtonToggle v-model="falseFirstDisabled" disabled />
            <span>Label</span>
          </div>
          <div class="flex gap-1">
            <ButtonToggle v-model="trueTriState" tri-state />
            <span>Label</span>
          </div>
          <div class="flex gap-1">
            <ButtonToggle v-model="falseTriState" tri-state />
            <span>Label</span>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>
