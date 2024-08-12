<script setup lang="ts">
import { computed, ref } from 'vue';
import Badge from 'lib/components/badge/Badge.vue';
import type { BadgeGroupProps } from 'lib/components/badgegroup/BadgeGroup.vue.d';
import Button from 'lib/components/button/Button.vue';
import Dialog from 'primevue/dialog';

const props = defineProps<BadgeGroupProps>();

const showedLabels = computed(() => {
  if (props.limit) return props.labels.slice(0, props.limit);
  return props.labels;
});

const totalLabelRemaining = computed(
  () => props.labels.length - showedLabels.value.length,
);

const detailDialog = ref(false);
</script>

<template>
  <div class="flex flex-nowrap items-center gap-1">
    <template v-if="props.limit">
      <Badge
        :key="index"
        v-for="(label, index) in showedLabels"
        :format="props.format"
        :label="label"
        :severity="props.severity"
      />
      <Button
        v-if="totalLabelRemaining"
        :label="`+${totalLabelRemaining} more`"
        :pt="{
          root: { style: 'padding: 2px !important; height: auto !important' },
          // label: { style: 'font-size: 9px !important' },
        }"
        @click="() => (detailDialog = true)"
        severity="dark"
        text
      />
    </template>
    <template v-else>
      <Badge
        :key="index"
        v-for="(label, index) in props.labels"
        :format="props.format"
        :label="label"
        :severity="props.severity"
      />
    </template>
  </div>

  <Dialog
    v-model:visible="detailDialog"
    :draggable="false"
    :header="headerLabel ?? 'Header'"
    :pt="{
      root: { style: 'width: 400px; padding: 12px 24px !important' },
    }"
    modal
  >
    <div class="flex flex-wrap gap-1">
      <Badge
        :key="index"
        v-for="(label, index) in props.labels"
        :format="props.format"
        :label="label"
        :severity="props.severity"
      />
    </div>
  </Dialog>
</template>
