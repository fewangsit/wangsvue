<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue';
import { TableColumn } from '../datatable/DataTable.vue.d';
import { CustomColumnProps } from './CustomColumn.vue.d';
import { cloneDeep } from 'lodash';

import useDataTableStore, {
  DataTableColumnConfig,
} from '../datatable/store/dataTable.store';

import Button from '../button/Button.vue';
import Checkbox from '../checkbox/Checkbox.vue';
import Menu from '../menu/Menu.vue';
import Icon from '../icon/Icon.vue';
import readConfig from '../datatable/helpers/readConfig.helper';
import MenuPreset from 'lib/preset/menu';

type DragableColumn = TableColumn & { order?: number };
const props = withDefaults(defineProps<CustomColumnProps>(), { type: 'menu' });

const emit = defineEmits<{
  'update:visibleColumns': [columns: TableColumn[]];
}>();

onMounted(async () => {
  const columnsConfig = await readConfig(
    props.tableId,
    cloneDeep(props.defaultColumns),
  );

  columnReorderData.value = columnsConfig;

  updateVisibleColumnsModel();
});

const hasReachMaxColumn = computed(() => {
  if (!props.maxColumn) return false;
  return filteredVisibleColumn.value.length >= props.maxColumn;
});

/**
 * Clone of default columns to be used in reorder and toggle visibility without mutating the default columns.
 * This `columnReorderData` ref will store the reordered table columns.
 *
 * On component loaded, we need to load the config to re-order the column list in the ColumnVisibiliy overlay menu.
 */
const columnReorderData = ref<DragableColumn[]>([]);

const draggedColumn = shallowRef<DragableColumn>();
const visibilityMenu = ref<typeof Menu>();
const visibilityMenuId = computed<string>(
  () => 'column-visibility-menu-' + props.tableId,
);

const columnVisibilityModel = computed({
  get: () => props.visibleColumns,
  set: (cols: TableColumn[]) => {
    emit('update:visibleColumns', cols);
  },
});

const toggleMenu = (event: Event): void => {
  if (visibilityMenu.value && 'toggle' in visibilityMenu.value) {
    visibilityMenu.value.toggle(event);
  }
};

/**
 * Starts the reordering of columns. Fired when user drag an item.
 *
 * @param {DragEvent} event - The drag event object.
 * @param {DragableColumn} item - The column item being dragged.
 * @param {number} index - The index of the column item being dragged.
 */
const startReorderColumn = (
  event: DragEvent,
  item: DragableColumn,
  index: number,
): void => {
  const { dataTransfer } = event;
  draggedColumn.value = item;

  if (dataTransfer) {
    dataTransfer.dropEffect = 'move';
    dataTransfer.effectAllowed = 'move';
    dataTransfer.setData('field', item.field);
    dataTransfer.setData('index', index.toString());
  }
};

/**
 * Handles the reordering of columns. Fired when user release the pointer.
 */
const onColumnReorder = async (): Promise<void> => {
  draggedColumn.value = undefined;
  reorderVisibleColumn();
  await setColumnVisibilityConfig();
};

const reorderVisibleColumn = (): void => {
  columnVisibilityModel.value = [...columnReorderData.value];
};

const filteredVisibleColumn = computed(() => {
  return [...columnReorderData.value].filter((col) => col.visible !== false);
});

const updateVisibleColumnsModel = (): void => {
  if (props.maxColumn && filteredVisibleColumn.value.length > props.maxColumn) {
    let visibleColumnsLength = 0;
    columnReorderData.value = columnReorderData.value.map((column) => {
      const spaceAvailable =
        props.maxColumn !== undefined && visibleColumnsLength < props.maxColumn;

      const visible =
        (column.checkedByDefault !== false && props.maxColumn === undefined) ||
        (column.checkedByDefault !== false && spaceAvailable);

      if (visible) visibleColumnsLength++;

      return {
        ...column,
        visible,
      };
    });
  }

  columnVisibilityModel.value = [...filteredVisibleColumn.value];
};

/**
 * Click event handler on `li` element to checks the checkbox insides.
 * @param {MouseEvent} event - The mouse event object.
 */
const checkTheCheckbox = (event: MouseEvent): void => {
  const label = (event.target as HTMLElement).querySelector('label');

  if (label) label.click();
};

/**
 * Resets the column visibility to default.
 */
const resetToDefault = (): void => {
  const defaultColumnClone: TableColumn[] = cloneDeep(props.defaultColumns);

  if (props.maxColumn && defaultColumnClone.length > props.maxColumn) {
    let visibleColumnsLength = 0;
    columnReorderData.value = defaultColumnClone.map((column) => {
      const spaceAvailable =
        props.maxColumn !== undefined && visibleColumnsLength < props.maxColumn;

      const visible =
        (column.checkedByDefault !== false && props.maxColumn === undefined) ||
        (column.checkedByDefault !== false && spaceAvailable);

      if (visible) visibleColumnsLength++;

      return {
        ...column,
        visible,
      };
    });
  } else {
    columnReorderData.value = defaultColumnClone;
  }

  columnVisibilityModel.value = [...filteredVisibleColumn.value];
  setColumnVisibilityConfig();
};

const setColumnVisibilityConfig = async (): Promise<void> => {
  const columnsConfig: DataTableColumnConfig[] = columnReorderData.value.map(
    (col) => {
      return {
        field: col.field,
        width: col.width ?? 'max-content',
        visible: col.visible !== false,
        fixed: !!col.fixed,
      };
    },
  );

  const { setConfig } = await useDataTableStore();
  setConfig(props.tableId, columnsConfig);
};

const teleportColumnList = (
  source: HTMLUListElement | null,
  target: HTMLElement | null,
): void => {
  source?.setAttribute('data-ts-section', 'custom-column-menu');
  source?.removeAttribute('style');

  target?.append(source ?? document.createElement('ul'));
};

const dragable = (item: TableColumn): boolean => {
  return item.dragable !== false && isSelectAble(item);
};

const getTeleportTarget = (): HTMLElement | null => {
  return document.getElementById(visibilityMenuId.value);
};

const isSelectAble = (item: TableColumn): boolean => {
  if (!hasReachMaxColumn.value) return true;

  const isChecked =
    columnVisibilityModel.value.findIndex((c) => c.field === item.field) > 0;

  /**
   * The checkbox should be selectable if:
   * - Selected column has not reach the max column
   * - reach the max column and the checkbox is currently checked (to uncheck).
   */
  return hasReachMaxColumn.value && isChecked;
};

const onDragEnter = (e: DragEvent, col: DragableColumn): void => {
  e.preventDefault(); // <-- Still essential

  if (dragable(col)) {
    const target = e.target as HTMLElement;
    const dropTargetLi =
      target.tagName === 'LI' ? target : target.closest('li');

    dropTargetLi?.classList.add('bg-primary-50');
    dropTargetLi?.nextElementSibling?.classList.remove('bg-primary-50');
    dropTargetLi?.previousElementSibling?.classList.remove('bg-primary-50');

    if (!dropTargetLi || !draggedColumn.value) return; // Safety checks

    const draggedIndex = columnReorderData.value.findIndex(
      (item) => item.field === draggedColumn.value?.field,
    );

    const dropTargetIndex = columnReorderData.value.findIndex(
      (item) => item.field === dropTargetLi.id,
    );

    if (draggedIndex !== -1 && dropTargetIndex !== -1) {
      // Swap the items in columnReorderData
      [
        columnReorderData.value[draggedIndex],
        columnReorderData.value[dropTargetIndex],
      ] = [
        columnReorderData.value[dropTargetIndex],
        columnReorderData.value[draggedIndex],
      ];
    }
  }
};

defineExpose({
  toggleMenu,
  resetToDefault,
});
</script>

<template>
  <Menu
    :id="visibilityMenuId"
    ref="visibilityMenu"
    v-if="props.type === 'menu'"
    :data-table-id="tableId"
    :pt="{
      root: {
        class: [...MenuPreset.root.class, 'shadow-panel'],
      },
      start: {
        class: [
          ...MenuPreset?.start.class,
          'border-b-[0.5px] border-solid border-grayscale-900',
        ],
      },
    }"
    @focus="
      teleportColumnList(
        $refs['columnList'] as HTMLUListElement,
        getTeleportTarget(),
      )
    "
    @hide="setColumnVisibilityConfig"
    append-to="body"
    auto-z-index
    data-ts-name="column-visibility"
    data-ts-section="menu"
    popup
  >
    <template #start>
      <Button
        @click="resetToDefault"
        data-ts-section="button-reset-default"
        label="Atur Ulang ke Default"
        text
      />
    </template>

    <template #item />
    <template #end />
  </Menu>

  <ul
    ref="columnList"
    v-show="type === 'flat'"
    :class="[
      { 'grid grid-rows-4 grid-flow-col-dense w-max gap-x-4': type === 'flat' },
      // { 'flex flex-col': type === 'menu' },
    ]"
    data-ts-section="custom-column-flat-list"
  >
    <template :key="item.field" v-for="(item, index) in columnReorderData">
      <li
        :id="item.field"
        v-if="item.reorderable !== false"
        :class="[
          'flex gap-1 py-[7px] px-4 transition-transform',
          {
            '!pl-0.5 !pr-2 !py-[4.5px]': type === 'flat',
          },
          {
            'cursor-grab [&_label]:cursor-grab ': dragable(item),
            'cursor-default [&_*]:cursor-default': !dragable(item),
          },
          '[&:has([selectable=false])]:!cursor-not-allowed',
          '[&:has([selectable=false])]:hover:!bg-transparent',
        ]"
        :data-item-dragable="dragable(item)"
        :draggable="dragable(item)"
        @click="checkTheCheckbox"
        @dragenter.prevent="onDragEnter($event, item)"
        @dragleave.prevent=""
        @dragover.prevent=""
        @dragstart="startReorderColumn($event, item, index)"
        @drop="onColumnReorder"
        @mouseenter="
          ($event.target as HTMLLIElement).classList.add(
            'bg-primary-50',
            'dark:bg-primary-50',
          )
        "
        @mouseleave="
          ($event.target as HTMLLIElement).classList.remove(
            'bg-primary-50',
            'dark:bg-primary-50',
          )
        "
        data-ts-section="custom-column-menu-item"
      >
        <Icon
          :class="[
            '!cursor-move w-[18px] h-[18px] !text-general-300 shrink-0',
            { invisible: item.dragable === false },
          ]"
          @click.stop=""
          icon="dragable-menu"
        />
        <Checkbox
          :aria-label="item.header"
          :disabled="item.fixed"
          :label="item.header"
          :model-value="item.visible !== false"
          :selectable="isSelectAble(item)"
          @click.stop=""
          @update:model-value="
            (event) => {
              item.visible = !!event;
              updateVisibleColumnsModel();
              setColumnVisibilityConfig();
            }
          "
          class="!w-full"
        />
      </li>
    </template>
  </ul>
</template>
