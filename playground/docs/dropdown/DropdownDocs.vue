<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Dropdown from 'lib/components/dropdown/Dropdown.vue';
import { ref } from 'vue';
import { OptionValue } from 'lib/types/options.type';

const model = ref<OptionValue>();
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Dropdown" />
    </template>
    <template #content>
      <div
        class="w-[300px] flex flex-col gap-3 h-auto p-4 relative bg-white rounded-[5px] border-2 border-dashed border-[#9747ff]"
      >
        <div class="flex flex-col gap-1">
          <Dropdown
            v-model="model"
            :options="['Waiting for Approval', 'Waiting for Handover']"
            label="Status"
            placeholder="Pilih status"
          />
        </div>
      </div>
    </template>
  </Card>
</template>
