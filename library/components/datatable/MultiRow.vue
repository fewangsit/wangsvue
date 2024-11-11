<script setup lang="ts">
import { inject } from 'vue';
import { MultiRowAttribute } from './DataTable.vue.d';

const props = defineProps<{
  attributes: MultiRowAttribute;
}>();

const Preset = inject<Record<string, any>>('preset', {}).datatable;
</script>

<template>
  <div v-bind="Preset?.multirowcontainer({ props })">
    <span
      :key="index"
      v-for="(attribute, index) in attributes"
      v-bind="
        Preset?.multirow({
          context: {
            firstIndex: index === 0,
          },
        })
      "
      :class="attribute.class"
    >
      {{ attribute.value }}
    </span>
  </div>
</template>
