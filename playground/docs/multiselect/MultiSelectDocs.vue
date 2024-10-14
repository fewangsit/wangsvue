<script setup lang="ts">
import { ref } from 'vue';
import { OptionValue } from 'lib/types/options.type';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import MultiSelect from 'lib/components/multiselect/MultiSelect.vue';
import Button from 'lib/components/button/Button.vue';

const model = ref<OptionValue[]>();
const items = ref(
  Array.from({ length: 100000 }, (_, i) => ({ label: `Item #${i}`, value: i })),
);
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="MultiSelect" />
    </template>
    <template #content>
      <div
        class="w-[300px] flex flex-col gap-3 h-auto p-4 relative bg-white rounded-[5px] border-2 border-dashed border-[#9747ff]"
      >
        <div class="flex flex-col gap-1">
          <MultiSelect
            v-model="model"
            :options="items"
            :show-optional-text="false"
            label="Status"
            option-label="label"
            option-value="value"
            placeholder="Pilih status"
          />
          <MultiSelect
            v-model="model"
            :invalid="true"
            :options="['Waiting for Approval', 'Waiting for Handover']"
            label="Status"
          />

          <Button @click="model = undefined" label="Empty Model" />
        </div>
      </div>

      <MultiSelect
        :options="['Waiting for Approval', 'Waiting for Handover']"
        controls
        label="Multi Select Controls"
      />
    </template>
  </Card>
</template>
