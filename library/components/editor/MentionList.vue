<script lang="ts" setup>
import { ref, watch, defineProps } from 'vue';
import Button from '../button/Button.vue';

const props = defineProps<{
  items: { id: string; label: string }[];
  command: (arg: { id: string; label: string }) => void;
}>();

const selectedIndex = ref(0);

const onKeyDown = (event: KeyboardEvent): boolean => {
  if (event.key === 'ArrowUp') {
    upHandler();
    return true;
  }
  if (event.key === 'ArrowDown') {
    downHandler();
    return true;
  }
  if (event.key === 'Enter') {
    enterHandler();
    return true;
  }
  return false;
};

const upHandler = (): void => {
  selectedIndex.value =
    (selectedIndex.value + props.items.length - 1) % props.items.length;
};

const downHandler = (): void => {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length;
};

const enterHandler = (): void => {
  selectItem(selectedIndex.value);
};

const selectItem = (index: number): void => {
  const item = props.items[index];
  if (item) {
    props.command({
      id: item.id,
      label: item.label,
    });
  }
};

defineExpose({
  onKeyDown,
});

watch(
  () => props.items,
  () => {
    selectedIndex.value = 0;
  },
);
</script>
<template>
  <div
    class="bg-white border border-gray-200 rounded-lg shadow-md flex flex-col gap-1 overflow-auto p-2 relative dropdown-menu"
  >
    <template v-if="items.length">
      <Button
        :key="index"
        v-for="(item, index) in items"
        :class="{
          'flex items-center gap-1 text-left w-full': true,
          'bg-gray-400 ': index === selectedIndex,
          'hover:bg-gray-100': true,
        }"
        :label="item.label"
        @click="selectItem(index)"
        severity="secondary"
      />
    </template>
    <div v-else class="item">No result</div>
  </div>
</template>
