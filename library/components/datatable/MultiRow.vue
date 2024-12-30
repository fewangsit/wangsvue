<script setup lang="ts">
import { inject } from 'vue';
import { MultiRowAttribute } from './DataTable.vue.d';

const props = defineProps<{
  attributes: MultiRowAttribute[];
}>();

const Preset = inject<Record<string, any>>('preset', {}).datatable;
</script>

<template>
  <div v-bind="Preset?.multirowcontainer({ props })">
    <span
      :key="index"
      v-for="(attribute, index) in attributes as MultiRowAttribute[]"
      v-bind="
        Preset?.multirow({
          context: {
            firstIndex: index === 0,
          },
        })
      "
      :class="attribute.class"
    >
      <component
        :is="attribute.bodyComponent!.component"
        v-if="attribute.bodyComponent"
        v-model="attribute.bodyComponent!.model"
        v-bind="attribute.bodyComponent!.props"
        :class="attribute.class"
        :disabled="attribute.bodyComponent!.disabled"
        v-on="
          attribute.bodyComponent!.events ? attribute.bodyComponent!.events : {}
        "
        @click.stop=""
      />
      <template v-else>{{ attribute.value }}</template>
    </span>
  </div>
</template>
