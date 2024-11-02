<script setup lang="ts">
import { computed, inject, shallowRef } from 'vue';
import Badge from 'lib/components/badge/Badge.vue';
import type { BadgeGroupProps } from 'lib/components/badgegroup/BadgeGroup.vue.d';
import Button from 'lib/components/button/Button.vue';
import Dialog from 'primevue/dialog';

const props = withDefaults(defineProps<BadgeGroupProps>(), {
  headerLabel: 'Header',
  emptyable: false,
});

const Preset = inject<Record<string, any>>('preset', {}).badgegroup;

const detailDialog = shallowRef(false);

const showedLabels = computed(() => {
  return props.labels.slice(0, props.limit); // When limit undefined, it will return full array
});

const totalRemainingLabel = computed(
  () => props.labels.length - showedLabels.value.length,
);
</script>

<template>
  <span v-if="props.emptyable && !showedLabels.length"> - </span>
  <div v-else v-bind="Preset?.root">
    <Badge
      :key="label"
      v-for="label in showedLabels"
      :format="props.format"
      :label="label"
      :severity="props.severity"
    />
    <Button
      v-if="totalRemainingLabel"
      :label="`+${totalRemainingLabel} more`"
      v-bind="Preset.showmorebutton"
      @click="detailDialog = true"
      severity="dark"
      text
    />

    <Dialog
      v-if="limit"
      v-model:visible="detailDialog"
      :draggable="false"
      :header="headerLabel"
      :pt="Preset.showmoredialog"
      modal
    >
      <Badge
        :key="label"
        v-for="label in props.labels"
        :format="props.format"
        :label="label"
        :severity="props.severity"
      />
    </Dialog>
  </div>
</template>
