<script lang="ts" setup>
import { shallowRef, watch } from 'vue';
import UserName from '../username/UserName.vue';

const props = defineProps<{
  items: {
    id: string;
    label: string;
    nickName: string;
    profilePicture: string;
  }[];
  command: (arg: { id: string; label: string }) => void;
}>();

const selectedIndex = shallowRef<number>(0);

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
    class="bg-white border border-gray-200 rounded-lg shadow-md flex flex-col max-h-72 overflow-y-scroll w-fit gap-1 p-2 relative"
  >
    <template v-if="items.length">
      <div
        :key="index"
        v-for="(item, index) in items"
        :class="{
          'hover:bg-gray-100 flex': true,
          '!bg-gray-100 ': index === selectedIndex,
        }"
        @click="selectItem(index)"
      >
        <UserName
          :user="{
            profilePicture: item.profilePicture,
          }"
          profile-picture-field="profilePicture"
        />
        <div class="flex flex-col gap-[1px]">
          <p>
            {{ item.label }}
          </p>
          <p class="!text-[10px] !font-light">
            {{ item.nickName }}
          </p>
        </div>
      </div>
    </template>
    <div v-else class="text-xs font-semibold">No result</div>
  </div>
</template>
