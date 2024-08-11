<script setup lang="ts">
import Card from 'wangsvue/card';
import DocTitle from '../DocTitle.vue';
import Checkbox from 'wangsvue/checkbox';
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Checkbox" />
    </template>
    <template #content>
      <div
        class="w-[324px] flex flex-col gap-3 h-[116px] p-4 relative bg-[#f8f7ee] rounded-[5px] border-2 border-dashed border-[#9747ff]"
      >
        <div class="flex gap-3">
          <Checkbox :model-value="false" label="Label" tooltip="Info" />
          <Checkbox
            :model-value="false"
            disabled
            label="Label"
            tooltip="Info"
          />
          <Checkbox :model-value="true" label="Label" tooltip="Info" />
          <Checkbox :model-value="true" disabled label="Label" tooltip="Info" />
        </div>
        <Checkbox
          :model-value="false"
          label="Label"
          tooltip="Within Table"
          within-table
        />
      </div>
    </template>
  </Card>
</template>
