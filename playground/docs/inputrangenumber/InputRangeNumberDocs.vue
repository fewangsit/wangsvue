<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import InputRangeNumber from 'lib/components/inputrangenumber/InputRangeNumber.vue';
import { ref } from 'vue';

const rangeValue = ref([]);
</script>
<template>
  <Card>
    <template #header>
      <DocTitle name="Input Range Number" />
    </template>
    <template #subtitle>
      The value is updated input blur. Press enter or tab to make the input blur
    </template>
    <template #content>
      <div class="flex flex-col gap-2">
        <InputRangeNumber v-model="rangeValue" class="max-w-48" label="Range" />
        Value: {{ rangeValue }}
      </div>
    </template>
  </Card>
</template>
