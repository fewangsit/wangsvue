<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  watch,
} from 'vue';
import { DataTableExpandedRows } from 'primevue/datatable';
import {
  TreeTableColumns,
  TreeTableEmits,
  TreeTableProps,
} from './TreeTable.vue.d';
import { Data, QueryParams } from '../datatable/DataTable.vue.d';
import { getNestedProperyValue } from 'lib/utils';
import { filterVisibleMenu } from '../helpers';
import Icon from '../icon/Icon.vue';
import Checkbox from 'primevue/checkbox';
import Preset from './treetable';
import Button from '../button/Button.vue';
import adjustMenuPositionHelper from './helpers/adjustMenuPosition.helper';
import CustomColumn from '../customcolumn/CustomColumn.vue';
import CustomColumnInstance from '../customcolumn/CustomColumn.vue.d';
import MenuInstance from '../menu/Menu.vue.d';
import Menu from '../menu/Menu.vue';
import eventBus, { TableEvent } from 'lib/event-bus';
import Paginator, { PageState } from 'primevue/paginator';
import { isArrayIncluded } from './helpers';

const props = withDefaults(defineProps<TreeTableProps>(), {
  tableName: 'treetable',
  selectionType: 'checkbox',
});

const emit = defineEmits<TreeTableEmits>();

const rowsPerPageOptions = [10, 25, 50, 100];

const dataTableID = ((): string => {
  const path = window.location.pathname.replace('/', '').split('/').join('-');
  return `${path}-${props.tableName}`;
})();

const currentPageTableData = ref<Data[]>();
const expandedRows = ref<DataTableExpandedRows>({});
const visibleColumns = ref<TreeTableColumns[]>(props.columns);
const checkboxSelection = ref<Data[]>([]);

const loadingTable = shallowRef(false);
const columnKey = shallowRef(0);
const tableKey = shallowRef(0);
const customColumnKey = shallowRef(0);

// Components Instance REFs
const customColumn = ref<CustomColumnInstance>();
const optionMenu = ref<MenuInstance>();

// Stores filter from event bus FilterContainer
const filterQueryParams = shallowRef<QueryParams>({});
const searchQueryParam = shallowRef<string>();
const sortBy = shallowRef<string>();
const sortOrder = shallowRef<-1 | 1>();
const tablePage = shallowRef(1);
const tableRows = shallowRef(10);
const totalRecords = shallowRef(0);

const queryParams = computed<QueryParams>(() => ({
  ...props.defaultQueryParams,
  search: props.lazy ? searchQueryParam.value : props.search,
  page: props.usePaginator ? tablePage.value : undefined,
  limit: props.usePaginator ? tableRows.value : undefined,
  sortOrder: sortOrder.value,
  sortBy: sortBy.value,
  ...(props.lazy ? filterQueryParams.value : props.filters), // This will resets the previous filters.
}));

const isExpandedAll = computed(() => {
  const rowsHasChildren = currentPageTableData.value?.filter(
    (d) => d.children?.length,
  );

  return (
    rowsHasChildren?.length &&
    rowsHasChildren.every((data) => expandedRows.value[data[props.dataKey]])
  );
});

/**
 * This computed variable determines wether the selection checkbox on header should be checked or not.
 * When select all data from bulkaction, the tableData value should not be updated.
 * The 'isSelectedAll' will be true if either the all current page data is selected or all records selected.
 */
const isSelectedAll = computed(() => {
  if (
    props.disableAllRows ||
    !fliterParentRowData()?.length ||
    props.selectionType !== 'checkbox'
  )
    return false;

  const length = checkboxSelection.value?.length;

  const currentPageDataKey =
    filterDisabledRows(fliterParentRowData())?.map((dt) => dt[props.dataKey]) ??
    [];

  const selectedDataKey =
    checkboxSelection.value?.map((dt) => dt[props.dataKey]) ?? [];

  const isCurrentPageAllSelected = selectedDataKey.length
    ? isArrayIncluded(currentPageDataKey, selectedDataKey)
    : false;

  const isAllRecordSelected =
    length ===
    (totalRecords.value ?? 0) - (currentPageDisabledRows.value.length ?? 0);

  return isCurrentPageAllSelected || isAllRecordSelected;
});

const currentPageDisabledRows = computed(() =>
  getDisabledRows(props.data ?? fliterParentRowData() ?? []),
);

const singleOptions = computed(() => {
  return filterVisibleMenu(props.options ?? []);
});

const isRowExpanded = (key: string): boolean => {
  const keys = Object.keys(expandedRows.value);
  return keys.includes(key);
};

const isRowSelected = (key: string): boolean => {
  return !!checkboxSelection.value.find((data) => data[props.dataKey] === key);
};

const fliterParentRowData = (rowData?: Data[]): Data[] => {
  return (rowData ?? currentPageTableData.value ?? []).filter(
    (d) => !d.childRowHeader && !d.childRow,
  );
};

const toggleRowExpand = (
  data: Data,
  indexOfData: number,
  isExpanding?: boolean,
): void => {
  const isExpandingRow = isExpanding ?? !isRowExpanded(data[props.dataKey]);

  if (isExpandingRow) {
    expandedRows.value[data[props.dataKey]] = true;
  } else {
    delete expandedRows.value[data[props.dataKey]];
  }

  if (indexOfData >= 0) {
    const { children } = data;

    if (children?.length) {
      const childHeader = props.childTableProps.header
        ? { childRowHeader: true, header: props.childTableProps.header }
        : undefined;

      const childrenRows = (childHeader ? [childHeader] : []).concat(
        children.map((child: Data) => ({
          childRow: true,
          ...child,
        })),
      );

      if (isExpandingRow)
        currentPageTableData.value.splice(indexOfData + 1, 0, ...childrenRows);
      else
        currentPageTableData.value.splice(indexOfData + 1, childrenRows.length);
    }
  }
};

const toggleAllDataSelection = (e: boolean): void => {
  checkboxSelection.value = e ? fliterParentRowData() : [];
};

const toggleRowSelection = (data: Data): void => {
  const selected = isRowSelected(data[props.dataKey]);
  if (selected)
    checkboxSelection.value = checkboxSelection.value.filter(
      (d) => d[props.dataKey] != data[props.dataKey],
    );
  else checkboxSelection.value.push(data);
};

const toggleExpandAll = (): void => {
  currentPageTableData.value.forEach((data, index) => {
    if (data.children?.length) toggleRowExpand(data, index);
  });
};

const toggleOptions = async (event: MouseEvent, data: Data): Promise<void> => {
  const eventTarget = event.target as HTMLElement;
  const button =
    eventTarget.tagName.toLowerCase() === 'button'
      ? eventTarget
      : eventTarget.parentElement;

  emit('toggleOption', data);

  const toggleEvent: Event = {
    ...event,
    currentTarget: event.currentTarget ?? event.target ?? event.srcElement,
  };

  removeClassActive();
  nextTick(() => {
    if (button?.classList.contains('option-button-active')) {
      removeClassActive();
    } else {
      optionMenu.value?.toggle(toggleEvent);
      removeClassActive();
      button?.classList.add('option-button-active');
    }

    nextTick(() => {
      const panel = document.getElementById('single-action-menu');

      if (panel) {
        const currentTop = parseFloat(panel.style.top) || 0;
        const currentLeft = parseFloat(panel.style.left) || 0;

        if (currentTop === 0 && currentLeft === 0) {
          const target = event.target as HTMLElement;
          const targetID = target.id;
          const windowWidth = window.innerWidth;

          const targetDOM = document.getElementById(targetID);

          if (targetDOM) {
            const { top, left, height, width } =
              targetDOM.getBoundingClientRect();

            const leftPos = left + width;

            panel.style.top = `${top + height}px`;
            panel.style.right = `${windowWidth - leftPos}px`;
            panel.style.left = 'auto';
          }
        }
      }
    });
  });
};

/**
 * Removes the active class from all buttons that have it.
 *
 * @returns {void}
 */
const removeClassActive = (): void => {
  const previouslyClicked = document.querySelectorAll('.option-button-active');

  previouslyClicked?.forEach((el) => {
    el.classList.remove('option-button-active');
  });
};

/**
 * This function resets data table-specific query parameters (page, limit, sortBy, sortOrder) back to their default value.
 */
const resetSortQuery = (): void => {
  sortBy.value = undefined;
  sortOrder.value = undefined;
};

const resetPage = (): void => {
  tablePage.value = 1;
};

const resetPageLimit = (): void => {
  tableRows.value = props.rows ?? 10;
  tablePage.value = 1;
};

const resetDataTableQuery = (): void => {
  resetPageLimit();
  resetSortQuery();
};

/**
 * On Search or Filter:
 * - Resets the table state by increment the key.
 * - Resets data table queryparams to default.
 */
const handleFilter = async (): Promise<void> => {
  tableKey.value++;

  resetDataTableQuery();
  refetch();
};

const handlePageChange = async (event: PageState): Promise<void> => {
  tableRows.value = event.rows;
  tablePage.value = event.page + 1;

  await refetch();

  /**
   * Miantain the rows expanded on page change
   */
  Object.keys(expandedRows.value).forEach((key) => {
    const index = currentPageTableData.value.findIndex(
      (d) => d[props.dataKey] == key,
    );
    if (index >= 0)
      toggleRowExpand(currentPageTableData.value[index], index, true);
  });
};

const sortColumn = (field: string): void => {
  if (field !== sortBy.value) sortOrder.value = undefined; // Resets the sortorder when the column sorted changed

  sortBy.value = field;

  if (!sortOrder.value) {
    sortOrder.value = 1;
  } else if (sortOrder.value == -1) {
    sortOrder.value = undefined;
    sortBy.value = undefined;
  } else {
    sortOrder.value = -1;
  }

  resetPage();
  refetch();
};

const refetch = async (): Promise<void> => {
  try {
    loadingTable.value = true;
    const response = await props.fetchFunction?.(queryParams.value);

    const { data, totalRecords: total = 0 } = response?.data ?? {}; // DispatchUpdateTotalRecordsEvent;
    currentPageTableData.value = data;
    totalRecords.value = total;
  } catch (error) {
    console.error('🚀 ~ refetch ~ error:', error);
  } finally {
    loadingTable.value = false;
  }
};

const headerCellPreset = (
  col?: TreeTableColumns,
  columnVisibility?: boolean,
): object => {
  return Preset.headercell({
    context: {
      columnVisibility,
      sorted: sortBy.value && sortBy.value === col?.field,
      sortable: col?.sortable,
    },
  });
};

const handleUpdateTableEvent = (event: TableEvent): void => {
  if (!event.tableName || event.tableName === props.tableName) {
    nextTick(() => {
      columnKey.value++;
      refetch();
    }); // Waits untill computed queryparams ready
  }
};

const filterDisabledRows = (
  tableData: Data[] | undefined,
  rowsIDs?: string[],
): Data[] => {
  return (tableData ?? []).filter(
    (data) =>
      !(rowsIDs ?? currentPageDisabledRows.value).includes(data[props.dataKey]),
  );
};

const getDisabledRows = (tableData: Data[] | undefined = []): string[] => {
  if (props.disableAllRows) return tableData.map((data) => data[props.dataKey]);
  return tableData
    .filter((data) => data[props.disableKey])
    .map((data) => data[props.dataKey]);
};

onMounted(async () => {
  if (props.fetchFunction) {
    await refetch();
    listenUpdateTableEvent();
  }

  attachEventListener();
});

onUnmounted(() => {
  removeEventListener();
});

watch(
  () => props.columns,
  () => {
    customColumnKey.value++;
  },
);

const attachEventListener = (): void => {
  eventBus.on('data-table:apply-filter', (e) => {
    if (e.tableName === props.tableName) {
      filterQueryParams.value = e.filter;
      handleFilter();
    }
  });

  eventBus.on('search-table', (e) => {
    if (e.tableName === props.tableName) {
      searchQueryParam.value = e.search;
      handleFilter();
    }
  });

  eventBus.on('data-table:clear-selected-data', (e) => {
    if (e.tableName === props.tableName) {
      checkboxSelection.value = [];
    }
  });
};

const removeEventListener = (): void => {
  eventBus.off('data-table:apply-filter');
  eventBus.off('data-table:clear-selected-data');
  eventBus.off('data-table:update');
  eventBus.off('search-table');
};

const listenUpdateTableEvent = (): void => {
  eventBus.on('data-table:update', handleUpdateTableEvent);
};
</script>

<template>
  <div v-bind="Preset.root">
    <table :id="dataTableID" v-bind="Preset.table" :key="tableKey">
      <thead>
        <tr class="border-b border-primary-100">
          <th
            @click="toggleAllDataSelection(!isSelectedAll)"
            v-bind="headerCellPreset()"
            class="w-[40px] text-center"
            data-wv-section="headercheckbox"
          >
            <Checkbox
              v-bind="Preset.headercheckbox"
              :class="[
                {
                  '[&_[data-pc-section=box]]:!border-white [&_[data-pc-section=box]]:!bg-transparent':
                    !isSelectedAll,
                },
              ]"
              :model-value="isSelectedAll"
              binary
              data-wv-section="headercheckbox"
            />
          </th>

          <th
            class="w-[40px] text-center"
            v-bind="headerCellPreset()"
            data-wv-section="headertoggler"
          >
            <Button
              :class="[
                '!p-0 !m-0 !w-auto !h-auto',
                { 'rotate-180': isExpandedAll },
                { 'rotate-0': !isExpandedAll },
              ]"
              @click="toggleExpandAll"
              icon="arrow-down"
              icon-class="w-6 h-6 text-white"
              text
            />
          </th>

          <th
            :key="col.field"
            v-for="col in visibleColumns"
            v-bind="headerCellPreset(col)"
            @click="sortColumn(col.field)"
          >
            <span class="inline-flex gap-2 items-center">
              {{ col.header }}

              <Icon
                v-if="col.sortable"
                :icon="
                  !sortBy || sortBy != col.field
                    ? 'arrow-up-down'
                    : sortOrder == 1
                      ? 'sort-desc'
                      : 'sort-asc'
                "
                class="text-base"
              />
            </span>
          </th>

          <th
            v-if="props.customColumn || props.useOption"
            @click="customColumn?.toggleMenu"
            v-bind="headerCellPreset(undefined, true)"
            class="sticky right-0"
          >
            <Icon
              v-if="props.customColumn"
              class="!w-4 !h-4 !mx-auto"
              icon="ellipsis-h"
              info="Visibilitas Kolom"
              tooltip-pos="left"
            />
          </th>
        </tr>
      </thead>

      <tbody v-if="!loadingTable" :="Preset.tbody">
        <template v-if="!currentPageTableData?.length">
          Tidak ada data
        </template>

        <template :key="index" v-for="(item, index) in currentPageTableData">
          <tr
            @click="toggleRowSelection(item)"
            class="border-b border-general-100"
            v-bind="
              Preset.bodyrow({
                context: {
                  selected: isRowSelected(item[dataKey]),
                },
                props,
              })
            "
          >
            <td
              @click.stop=""
              v-bind="Preset.bodycell"
              class="w-[40px] text-center"
            >
              <Checkbox
                v-if="!item.childRow && !item.childRowHeader"
                v-bind="Preset.rowcheckbox"
                v-model="checkboxSelection"
                :value="item"
              />
            </td>

            <td
              @click="
                (e) => {
                  if (item.childRow || item.childRowHeader) e.stopPropagation();
                }
              "
              v-bind="Preset.bodycell"
              class="w-[40px] text-center"
            >
              <Button
                v-if="item.children?.length"
                :class="[
                  '!p-0 !m-0 !w-auto !h-auto',
                  { 'rotate-180': isRowExpanded(item[dataKey]) },
                  { 'rotate-0': !isRowExpanded(item[dataKey]) },
                ]"
                @click.stop="toggleRowExpand(item, index)"
                icon="arrow-down"
                icon-class="w-6 h-6"
                text
              />
            </td>

            <td
              v-if="item.childRowHeader"
              :class="[Preset.bodycell.class, 'font-semibold text-xs']"
              :colspan="props.columns.length"
              @click.stop=""
            >
              {{ item.header }}
            </td>

            <template v-else>
              <td
                :key="col.field"
                v-for="col in item.childRow
                  ? (props.childTableProps.columns ?? columns)
                  : visibleColumns"
                :colspan="col.colspan"
                v-bind="Preset.bodycell"
              >
                <template
                  v-if="col.bodyComponent || col.bodyClass || col.bodyTemplate"
                >
                  <component
                    :is="col.bodyComponent!(item).component"
                    v-if="col.bodyComponent"
                    v-model="col.bodyComponent!(item).model"
                    :disabled="col.bodyComponent!(item).disabled"
                    v-bind="col.bodyComponent!(item).props"
                    v-on="
                      col.bodyComponent!(item).events
                        ? col.bodyComponent!(item).events
                        : {}
                    "
                    @change="col.bodyComponent!(item).onChange?.(item)"
                    @click.stop=""
                    @update:model-value="
                      col.bodyComponent!(item).onChange?.(item)
                    "
                  />

                  <span
                    v-else
                    :class="
                      typeof col.bodyClass === 'function'
                        ? col.bodyClass(item)
                        : col.bodyClass
                    "
                  >
                    <template v-if="col.bodyTemplate">
                      {{ (col.bodyTemplate && col.bodyTemplate(item)) || '-' }}
                    </template>
                    <template v-else>
                      {{ getNestedProperyValue(item, col.field) || '-' }}
                    </template>
                  </span>
                </template>

                <template v-else>
                  {{ getNestedProperyValue(item, col.field) ?? '-' }}
                </template>
              </td>

              <td v-bind="Preset.bodycell" class="sticky right-0 bg-white">
                <div
                  class="relative w-full h-full flex items-center justify-center"
                  data-wv-section="single-action-wrapper"
                >
                  <Button
                    :id="'button-action-' + item[props.dataKey]"
                    :class="[
                      {
                        'pointer-events-none !border-general-100 [&>i]:text-general-200':
                          disableAllRows,
                      },
                      { 'pointer-events-auto': !disableAllRows },
                    ]"
                    :disabled="disableAllRows"
                    @click.stop="toggleOptions($event, item)"
                    data-wv-section="button-action"
                    icon="ellipsis-h"
                    outlined
                    severity="secondary"
                    size="small"
                    tooltip="Aksi"
                    tooltip-pos="left"
                    type="button"
                  />
                </div>
              </td>
            </template>
          </tr>
        </template>
      </tbody>
    </table>

    <template v-if="loadingTable">
      <div class="w-full p-4 flex items-center justify-center">
        <img
          alt="Table is loading data"
          class="w-14 h-auto"
          src="../../assets/loading.gif"
        />
      </div>
    </template>

    <Paginator
      v-model:rows="tableRows"
      :rows-per-page-options="rowsPerPageOptions"
      :total-records="totalRecords"
      @page="handlePageChange"
      class="sticky left-0"
      current-page-report-template="Menampilkan {first} - {last} dari {totalRecords}"
      template="FirstPageLink PrevPageLink PageLinks JumpToPageInput NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    >
      <template #firstpagelinkicon>
        <Icon icon="round-keyboard-double-arrow-left" />
      </template>

      <template #lastpagelinkicon>
        <Icon icon="round-keyboard-double-arrow-right" />
      </template>

      <template #prevpagelinkicon>
        <Icon icon="round-keyboard-arrow-left" />
      </template>

      <template #nextpagelinkicon>
        <Icon icon="round-keyboard-arrow-right" />
      </template>
    </Paginator>

    <Menu
      id="single-action-menu"
      ref="optionMenu"
      :model="singleOptions"
      @focus="adjustMenuPositionHelper"
      append-to="body"
      auto-z-index
      popup
    />

    <CustomColumn
      :key="customColumnKey"
      ref="customColumn"
      v-if="props.customColumn"
      v-model:visible-columns="visibleColumns"
      :default-columns="columns.filter((col) => col.visible !== false)"
      :table-id="dataTableID"
    />
  </div>
</template>
