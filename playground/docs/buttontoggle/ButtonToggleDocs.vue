<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import ButtonToggle from 'lib/components/buttontoggle/ButtonToggle.vue';
import { ref } from 'vue';

const trueFirst = ref<boolean>(true);
const trueFirstDisabled = ref<boolean>(true);
const falseFirst = ref<boolean>(false);
const falseFirstDisabled = ref<boolean>(false);

const trueTriState = ref<boolean>(true);
const falseTriState = ref<boolean>(false);
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
