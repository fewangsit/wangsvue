<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Button from '../button/Button.vue';
import { FilterContainerEmits } from './FilterContainer.vue.d';

defineEmits<FilterContainerEmits>();

const container = ref<HTMLDivElement | null>(null);
const contentKey = ref<number>(0);

onMounted(() => {
  if (container.value) {
    const { children } = container.value;
    const childCount = container.value.childElementCount;
    const isOdd = childCount % 4;

    let [rowPos, colPos] = [1, 1];
    for (const i in Array.from({ length: childCount })) {
      const isLast = Number(i) === childCount - 1;
      children[i].setAttribute(
        'style',
        `grid-area: ${rowPos}/${isLast && isOdd ? 4 : colPos}`,
      );

      if (++colPos > 4) {
        colPos = 1;
        rowPos++;
      }
    }
  }
});
</script>

<template>
  <div
    ref="container"
    :class="[
      ' bg-primary-50 rounded-[7px] [&>*]:w-full [&>*]min-w-0',
      'grid items-end grid-cols-4 p-3 gap-4',
    ]"
    data-name="filter-container"
  >
    <slot :key="contentKey" />
    <div
      class="flex items-end justify-end gap-2"
      data-section-name="filter-action-buttons"
    >
      <Button
        @click="$emit('clear'), contentKey++"
        label="Bersihkan Field"
        text
      />
      <Button @click="$emit('apply')" label="Terapkan" severity="success" />
    </div>
  </div>
</template>
