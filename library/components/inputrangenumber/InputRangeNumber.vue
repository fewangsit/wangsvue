<script setup lang="ts">
import InputNumber from 'primevue/inputnumber';
import FieldWrapper from '../fieldwrapper/FieldWrapper.vue';
import InputGroup from '../inputgroup/InputGroup.vue';

import { InputRangeNumberProps } from './InputRangeNumber.vue.d';

const props = withDefaults(defineProps<InputRangeNumberProps>(), {
  minPlaceholder: 'Tulis',
  maxPlaceholder: 'Tulis',
  placeholder: 'Tulis',
});

const rangeValue = defineModel<number[]>({ default: [] });
</script>
<template>
  <FieldWrapper :label="props.label">
    <div
      class="flex gap-2 w-full items-center"
      data-section-name="inputwrapper"
    >
      <InputGroup>
        <InputNumber
          v-bind="$props"
          v-model="rangeValue[0]"
          :placeholder="placeholder ?? minPlaceholder"
          :use-grouping="false"
          class="w-full"
          input-id="range-start"
        />
      </InputGroup>
      -
      <InputGroup>
        <InputNumber
          v-bind="$props"
          v-model="rangeValue[1]"
          :placeholder="placeholder ?? minPlaceholder"
          :use-grouping="false"
          class="w-full"
          input-id="range-end"
        />
      </InputGroup>
    </div>
  </FieldWrapper>
</template>
