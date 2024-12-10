<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  watch,
} from 'vue';

import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import { exportToExcel, getNestedProperyValue, useToast } from 'lib/utils';
import { cloneDeep } from 'lodash';

import { Booleanish } from '../ts-helpers';
import { isArrayIncluded, adjustMenuPositionHelper } from './helpers';
import {
  DataTableRowReorderEvent,
  DataTableCellEditedEvent,
  TreeTableColumns,
  DataTableEmits,
  DataTableProps,
  FetchResponse,
  QueryParams,
  Data,
  ColumnTogglePreset,
  ChildTableProps,
} from './DataTable.vue.d';

import loadingTableLottie from 'lib/assets/lottie/loading-table.lottie';
import noDataLottie from 'lib/assets/lottie/no-data.lottie';

import eventBus, { Events, TableEvent } from 'lib/event-bus';
import Paginator, { PageState } from 'primevue/paginator';

import Checkbox from 'primevue/checkbox';
import InputSwitch from 'primevue/inputswitch';
import MenuInstance from '../menu/Menu.vue.d';
import Icon from '../icon/Icon.vue';
import Menu from '../menu/Menu.vue';
import Toast from '../toast/Toast.vue';
import Button from '../button/Button.vue';
import CustomColumn from '../customcolumn/CustomColumn.vue';
import CustomColumnInstance from '../customcolumn/CustomColumn.vue.d';
import useLoadingStore from '../loading/store/loading.store';
import DialogConfirm from '../dialogconfirm/DialogConfirm.vue';
import MultiRow from './MultiRow.vue';

type DragableRow = Data & { draggable?: boolean; order?: number };

const props = withDefaults(defineProps<DataTableProps>(), {
  tableName: 'datatable',
  tableTitle: undefined,
  lazy: true,
  options: () => [],
  dataKey: '_id',
  disableKey: 'isDefault',
  selectionType: 'checkbox',
  customColumn: true,
  useOption: true,
  rowHeight: 'fixed',
});

const emit = defineEmits<DataTableEmits>();
const singleSelection = defineModel<Data>('singleSelection');

const Preset = inject<Record<string, any>>('preset', {}).datatable;

const rowsPerPageOptions = [10, 25, 50, 100];
const toast = useToast();
const { setLoading } = useLoadingStore();

const dataTableID = ((): string => {
  const path = window.location.pathname.replace('/', '').split('/').join('-');
  return `${path}-${props.tableName}`;
})();

const currentPageTableData = ref<Data[]>(props.data ?? []);
const expandedRows = ref<Record<string, number>>({});
const visibleColumns = ref<TreeTableColumns[]>(props.columns);
const checkboxSelection = ref<Data[]>([]);
const rowReorderEventPayload = ref<DataTableRowReorderEvent>();
const tableWrapper = ref<HTMLDivElement>();
const rowSingleActionCell = ref<HTMLTableCellElement>();

const customColumnKey = shallowRef<number>(0);
const loadingTable = shallowRef<boolean>(false);
const loadingRows = shallowRef<boolean>(false);
const columnKey = shallowRef<number>(0);
const tableKey = shallowRef<number>(0);
const dragging = shallowRef<boolean>(false);
const draggedRow = shallowRef<DragableRow>();
const rightDistanceFrozenColumn = shallowRef<number>(0);

// Components Instance REFs
const customColumn = ref<CustomColumnInstance>();
const optionMenu = ref<MenuInstance>();

/**
 * Clone of default row to be used in reorder and toggle visibility without mutating the default rows.
 * This `rowReorderData` ref will store the reordered table rows.
 *
 * On component loaded, we need to load the config to re-order the row list.
 */
const rowReorderData = ref<DragableRow[]>([]);

// Stores filter from event bus FilterContainer
const filterQueryParams = shallowRef<QueryParams>({});
const searchQueryParam = shallowRef<string>();
const sortBy = shallowRef<string>();
const sortOrder = shallowRef<-1 | 1>();
const tablePage = shallowRef(1);
const tableRows = shallowRef(10);
const totalRecords = shallowRef(0);
const showConfirmToggle = ref<Record<string, boolean>>({});

const visibleChildTableColumns = computed(() => {
  if (props.childTableProps?.columns)
    return props.childTableProps?.columns.filter((col) => {
      return (
        !col.parentColumnsFields ||
        col.parentColumnsFields?.some((field) =>
          visibleColumns.value.some((c) => c.field === field),
        )
      );
    });

  return visibleColumns.value;
});

const queryParams = computed<QueryParams>(() => ({
  ...props.defaultQueryParams,
  search: props.lazy ? searchQueryParam.value : props.search,
  page: props.usePaginator ? tablePage.value : undefined,
  limit: props.usePaginator ? tableRows.value : undefined,
  sortOrder: sortOrder.value,
  sortBy: sortBy.value,
  ...(props.lazy ? filterQueryParams.value : props.filters), // This will reset the previous filters.
}));

const isExpandedAll = computed(() => {
  const rowsHasChildren = currentPageTableData.value?.filter(
    (d) => d.children?.length || d.hasChildren,
  );

  return (
    rowsHasChildren?.length &&
    rowsHasChildren.every((data) => expandedRows.value[data[props.dataKey]] > 0)
  );
});

/**
 * This computed variable determines whether the selection checkbox on header should be checked or not.
 * When select all data from bulk action, the tableData value should not be updated.
 * The 'isSelectedAll' will be true if either the all current page data is selected or all records selected.
 */
const isSelectedAll = computed(() => {
  if (
    props.disableAllRows ||
    !filterParentRowData()?.length ||
    props.selectionType !== 'checkbox' ||
    currentPageDisabledRows.value?.length === currentPageTableData.value.length
  )
    return false;

  const length = checkboxSelection.value?.length;

  const currentPageDataKey =
    filterDisabledRows(filterParentRowData())?.map((dt) => dt[props.dataKey]) ??
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
  getDisabledRows(props.data ?? filterParentRowData() ?? []),
);

const isRowExpanded = (key: string): boolean => {
  const keys = Object.keys(expandedRows.value);
  return keys.includes(key);
};

const isRowDisabled = (key: string): boolean => {
  const keys = currentPageDisabledRows.value;
  return keys.includes(key);
};

const isRowSelected = (key: string): boolean => {
  return !!checkboxSelection.value.find((data) => data[props.dataKey] === key);
};

const filterParentRowData = (rowData?: Data[]): Data[] => {
  return (rowData ?? currentPageTableData.value ?? []).filter(
    (d) => !d.childRowHeader && !d.childRow,
  );
};

const toggleRowExpand = async (
  data: Data,
  indexOfData: number,
  isExpanding?: boolean,
): Promise<void> => {
  const isExpandingRow = isExpanding ?? !isRowExpanded(data[props.dataKey]);

  if (!loadingRows.value) {
    if (!isExpandingRow) {
      currentPageTableData.value.splice(
        indexOfData + 1,
        expandedRows.value[data[props.dataKey]],
      );
      delete expandedRows.value[data[props.dataKey]];
    } else {
      expandedRows.value[data[props.dataKey]] = 1;

      let { children } = data;

      if (props.childTableProps?.fetchFunction && data.hasChildren) {
        try {
          // Add loading animation row
          currentPageTableData.value.splice(indexOfData + 1, 0, {
            childRow: true,
            loadingRow: true,
          });
          loadingRows.value = true;
          const fetchChildren =
            await props.childTableProps?.fetchFunction(data);
          children = fetchChildren.data;
        } catch (error) {
          console.error('🚀 ~ toggleRowExpand ~ error:', error);
        } finally {
          // Remove loading animation row
          currentPageTableData.value.splice(indexOfData + 1, 1);
          loadingRows.value = false;
        }
      }

      if (indexOfData >= 0 && children?.length) {
        const childrenRows = children.flatMap((child) => {
          const rowHeader: Data = {
            childRowHeader: true,
            header: child.groupHeader,
          };

          return [
            rowHeader,
            ...(child.groupItems ?? []).map((d) => ({ childRow: true, ...d })),
          ];
        });

        expandedRows.value[data[props.dataKey]] = childrenRows.length;
        currentPageTableData.value.splice(indexOfData + 1, 0, ...childrenRows);
      } else {
        currentPageTableData.value.splice(indexOfData + 1, 0, {
          childRow: true,
          noDataRow: true,
        });
      }
    }
  }
};

const toggleAllDataSelection = (e: boolean): void => {
  checkboxSelection.value = e ? filterDisabledRows(filterParentRowData()) : [];
};

const toggleRowSelection = (event: Event, data: Data, index: number): void => {
  if (
    !data.childRow &&
    !data.childRowHeader &&
    !isRowDisabled(data[props.dataKey]) &&
    props.selectionType !== 'none'
  ) {
    const selected = isRowSelected(data[props.dataKey]);

    emit('rowSelect', { originalEvent: event, data, index });

    if (props.selectionType === 'checkbox') {
      if (selected)
        checkboxSelection.value = checkboxSelection.value.filter(
          (d) => d[props.dataKey] != data[props.dataKey],
        );
      else checkboxSelection.value.push(data);
    } else {
      singleSelection.value = selected ? undefined : data;
    }
  }
};

const toggleExpandAll = async (): Promise<void> => {
  const isExpanding = !isExpandedAll.value;
  if (!loadingRows.value) {
    let index = 0;
    for (const data of currentPageTableData.value) {
      if (data.children?.length || data.hasChildren) {
        await toggleRowExpand(data, index, isExpanding);
      }
      index++;
    }
  }
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
    currentTarget: event.currentTarget ?? event.target,
  };

  removeClassActive();
  await nextTick(() => {
    if (button?.classList.contains('option-button-active')) {
      removeClassActive();
    } else {
      optionMenu.value?.toggle(toggleEvent);
      removeClassActive();
      button?.classList.add('option-button-active');
    }
  });
};

const draggable = (item: DragableRow): boolean => {
  return (
    item.draggable !== false &&
    !item.childRow &&
    !item.childRowHeader &&
    props.reorderable &&
    !sortOrder.value
  );
};

/**
 * Starts the reordering of rows. Fired when user drag an item.
 *
 * @param {DragEvent} event - The drag event object.
 * @param {DragableRow} item - The row item being dragged.
 * @param {number} index - The index of the row item being dragged.
 */
const startReorderRow = (
  event: DragEvent,
  item: DragableRow,
  index: number,
): void => {
  if (item.childRow || item.childRowHeader) return;
  expandedRows.value = {}; // Collapse the expanded rows on Row Reorder

  const { dataTransfer } = event;
  draggedRow.value = item;

  rowReorderEventPayload.value = { item, fromIndex: index };

  if (dataTransfer) {
    dataTransfer.dropEffect = 'move';
    dataTransfer.effectAllowed = 'move';
    dataTransfer.setData('id', item._id);
    dataTransfer.setData('index', index.toString());
  }
};

const onDragEnter = (e: DragEvent, row: DragableRow): void => {
  e.preventDefault(); // <-- Still essential

  if (draggable(row)) {
    const target = e.target as HTMLElement;
    const dropTargetTr =
      target.tagName === 'TR' ? target : target.closest('tr');

    dropTargetTr?.classList.add('bg-primary-50');
    dropTargetTr?.nextElementSibling?.classList.remove('bg-primary-50');
    dropTargetTr?.previousElementSibling?.classList.remove('bg-primary-50');

    if (!dropTargetTr || !draggedRow.value) return; // Safety checks

    const draggedIndex = rowReorderData.value.findIndex(
      (item) => item._id === draggedRow.value?._id,
    );

    const dropTargetIndex = rowReorderData.value.findIndex(
      (item) => item._id === dropTargetTr.id,
    );

    if (draggedIndex !== -1 && dropTargetIndex !== -1) {
      if (rowReorderEventPayload.value)
        rowReorderEventPayload.value.toIndex = dropTargetIndex;

      // Swap the items in columnReorderData
      [
        rowReorderData.value[draggedIndex],
        rowReorderData.value[dropTargetIndex],
      ] = [
        rowReorderData.value[dropTargetIndex],
        rowReorderData.value[draggedIndex],
      ];

      reorderVisibleColumn();
    }
  }
};

/**
 * Handles the reordering of columns. Fired when user release the pointer.
 */
const onRowReorder = (): void => {
  if (rowReorderEventPayload.value) {
    emit('rowReorder', rowReorderEventPayload.value);
  }

  draggedRow.value = undefined;
  dragging.value = false;
  rowReorderEventPayload.value = undefined;
};

const reorderVisibleColumn = (): void => {
  currentPageTableData.value = [...rowReorderData.value];
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
  await reFetch();
};

const handlePageChange = async (event: PageState): Promise<void> => {
  tableRows.value = event.rows;
  tablePage.value = event.page + 1;

  await reFetch();

  /**
   * Maintain the rows expanded on page change
   */
  Object.keys(expandedRows.value).forEach((key) => {
    const index = currentPageTableData.value.findIndex(
      (d) => d[props.dataKey] == key,
    );
    if (index >= 0)
      toggleRowExpand(currentPageTableData.value[index], index, true);
  });
};

const sortColumn = (field: string, e: Event): void => {
  if (field !== sortBy.value) sortOrder.value = undefined; // Resets the sort order when the column sorted changed

  sortBy.value = field;

  if (!sortOrder.value) {
    sortOrder.value = 1;
  } else if (sortOrder.value == -1) {
    sortOrder.value = undefined;
    sortBy.value = undefined;
  } else {
    sortOrder.value = -1;
  }

  emit('sort', {
    sortOrder: sortOrder.value,
    sortField: sortBy.value,
    originalEvent: e,
    rows: tableRows.value,
  });

  resetPage();
  reFetch();
};

const reFetch = async (): Promise<void> => {
  try {
    loadingTable.value = true;
    const response = await props.fetchFunction?.(queryParams.value);

    const { data = [], totalRecords: total = 0 } = response?.data ?? {};
    updateTotalRecordBulkAction(total);
    currentPageTableData.value = data;
    rowReorderData.value = [...currentPageTableData.value];
    totalRecords.value = total;
  } catch (error) {
    console.error('🚀 ~ reFetch ~ error:', error);
  } finally {
    loadingTable.value = false;
    expandedRows.value = {};
  }
};

/**
 * Used in export excel and event listener from Bulk action select all data.
 */
const fetchAllData = async (
  isDownload?: boolean,
): Promise<FetchResponse['data']> => {
  const params = cloneDeep(queryParams.value);
  delete params.page;
  delete params.limit;

  const { data } = (await props.fetchFunction?.(params)) ?? {};
  if (!data && isDownload) throw new Error(); // To make the downloadExcel function catches the error and show toast error.
  return data ?? { data: [], totalRecords: 0 };
};

/**
 * Handle select all data from bulk action.
 */
const selectAllData = async (event: TableEvent): Promise<void> => {
  if (props.tableName !== event.tableName) return;

  try {
    loadingTable.value = true;
    const { data, totalRecords: total = 0 } = props.lazy
      ? await fetchAllData()
      : { totalRecords: (props.data ?? []).length, data: props.data };

    const disabledRows = getDisabledRows(data);
    checkboxSelection.value = filterDisabledRows(data, disabledRows);

    updateTotalRecordBulkAction(total);
  } finally {
    loadingTable.value = false;
  }
};

const headerCellPreset = (
  col?: TreeTableColumns,
  useCustomColumn?: boolean,
): Record<string, unknown> => {
  return Preset?.headercell({
    props,
    context: {
      sortOrder: sortOrder.value,
      customColumn: useCustomColumn,
      sorted: sortBy.value && sortBy.value === col?.field,
      sortable: col?.sortable,
    },
  });
};

const handleUpdateTableEvent = (event: TableEvent): void => {
  if (!event.tableName || event.tableName === props.tableName) {
    nextTick(() => {
      columnKey.value++;
      reFetch();
    }); // Waits until computed queryparams ready
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

const downloadExcel = async ({
  tableName,
  multiTableNames,
  fileName,
  additionalTexts,
}: Events['data-table:download']): Promise<void> => {
  if (
    tableName !== props.tableName &&
    !multiTableNames?.includes(props.tableName)
  )
    return;

  const excelColumns = visibleColumns.value.filter(
    (col) => col.visible !== false,
  );

  const includedColumns = excelColumns.filter((col) => !col.excluded);
  const headers = includedColumns.map(
    (col) => col.header ?? col.exportHeader ?? '-',
  );

  const formatFileName = (): string => {
    return fileName
      .trim() // Remove extra space
      .replace(/[^a-zA-Z0-9\s]/g, '-') // Replace special characters with dash
      .replace(/\s+/g, '-') // Replace spaces with dash
      .replace(/-+/g, '-') // Replace multiple dashes with a single dash
      .replace(/-+$/, ''); // Remove trailing dash
  };

  try {
    // To make sure, 1 time event didn't listened twice
    eventBus.off('data-table:download', downloadHandler);
    // To make sure, if property `multiTableNames` is exist in event, then its tableName should equal to DataTable's tableName to call the fetch function and the rest of logics
    if (tableName === props.tableName) {
      setLoading(true, 'Mengunduh data');

      const { data } = props.fetchFunction
        ? await fetchAllData(true)
        : { data: props.data };

      const excelBody = (data ?? []).map((item: Data) => {
        const body = {} as Record<string, unknown>;

        includedColumns.forEach((col) => {
          const { field: colField, exportField } = col;
          const field = exportField ?? colField; // Prioritize the exportField than colField.
          const fieldValue = getNestedProperyValue(item, field) || '-';

          if (col.includeTruthyProperties) {
            const objectValue = (fieldValue ?? {}) as Record<
              string,
              Booleanish
            >;

            const truthyProperties = Object.keys(objectValue)
              .map((key) => {
                if (objectValue[key]) return key;
              })
              .filter(Boolean);

            body[field] = truthyProperties.join(',');
          } else if (Array.isArray(fieldValue)) {
            let arrayValue = fieldValue;

            if (col.arrayValueField) {
              /**
               * Support for export array data with deeply nested array.
               *
               * If the array is only string array, only return its value.
               */
              arrayValue = fieldValue.map((value) => {
                if (col.arrayValueField)
                  return getNestedProperyValue(value, col.arrayValueField);
                return value;
              });
            }

            body[field] = arrayValue.join(arrayValue.length > 1 ? ',' : ''); // Only join with comma if the length at least two item
          } else if (col.booleanValue) {
            body[field] = fieldValue ? 'Ya' : 'Tidak';
          } else {
            body[field] = fieldValue;
          }
        });

        return body;
      });

      if (multiTableNames?.length) {
        eventBus.emit('button-download:multi-tables', {
          table: {
            headers,
            data: excelBody,
            tableName,
            tableTitle: props.tableTitle,
          },
        });

        return;
      }

      /**
       * There's a little change to call util `exportToExcel`, just put `{headers, data}` as the value of key "tables"
       */
      await exportToExcel({
        tables: [
          { headers, data: excelBody, tableName, tableTitle: props.tableTitle },
        ],
        fileName: formatFileName(),
        additionalTexts,
      });
    }
  } catch (error) {
    console.error(error);
    toast.removeAllGroups();
    toast.add({
      message: props.excelToastErrorMessage ?? 'Data gagal diunduh.',
      error,
      group: 'download',
    });
  } finally {
    setLoading(false);
    eventBus.on('data-table:download', downloadHandler); // Re-listen the event when export excel finished
  }
};

onMounted(async () => {
  if (props.fetchFunction) {
    await reFetch();
    listenUpdateTableEvent();
  }

  attachEventListener();

  if (tableWrapper.value) {
    tableWrapper.value.onscroll = adjustFrozenColumnRightDistance;

    new ResizeObserver(adjustFrozenColumnRightDistance).observe(
      tableWrapper.value,
    );
  }
});

onUnmounted(() => {
  removeEventListener();
});

watch(
  () => props.columns,
  () => {
    if (!props.customColumn) visibleColumns.value = props.columns;
    customColumnKey.value++;
  },
);

watch(
  () => props.data,
  (data) => {
    currentPageTableData.value = data ?? [];
  },
);

watch(
  checkboxSelection,
  (newSelectedData: Data[]) => {
    emit('selectData', newSelectedData);
    emit('update:selectedData', newSelectedData);

    eventBus.emit('data-table:update-selected-data', {
      tableName: props.tableName,
      data: newSelectedData,
    });
  },
  { deep: true },
);

const attachEventListener = (): void => {
  eventBus.on('data-table:apply-filter', applyFilterHandler);
  eventBus.on('search-table', searchTableHandler);
  eventBus.on('data-table:clear-selected-data', clearSelectedDataHandler);
  eventBus.on('data-table:select-all-record', selectAllRecordHandler);
  eventBus.on('data-table:download', downloadHandler);
};

const removeEventListener = (): void => {
  eventBus.off('data-table:update', handleUpdateTableEvent);
  eventBus.off('data-table:apply-filter', applyFilterHandler);
  eventBus.off('search-table', searchTableHandler);
  eventBus.off('data-table:clear-selected-data', clearSelectedDataHandler);
  eventBus.off('data-table:select-all-record', selectAllRecordHandler);
  eventBus.off('data-table:download', downloadHandler);
};

const applyFilterHandler = (e: Events['data-table:apply-filter']): void => {
  if (e.tableName === props.tableName) {
    filterQueryParams.value = e.filter;
    handleFilter();
  }
};

const searchTableHandler = (e: Events['search-table']): void => {
  if (e.tableName === props.tableName) {
    searchQueryParam.value = e.search;
    handleFilter();
  }
};

const selectAllRecordHandler = (
  e: Events['data-table:select-all-record'],
): void => {
  if (e.tableName === props.tableName) {
    selectAllData(e);
  }
};

const clearSelectedDataHandler = (
  e: Events['data-table:clear-selected-data'],
): void => {
  if (e.tableName === props.tableName) {
    checkboxSelection.value = [];
  }
};

const downloadHandler = (e: Events['data-table:download']): void => {
  if (
    e.tableName === props.tableName ||
    e.multiTableNames?.includes(props.tableName)
  ) {
    downloadExcel(e);
  }
};

/**
 * TO dynamically set the single action and column visibility right position.
 *
 * It needs to be done because class the td and th cannot be relative to tablewrapper
 */
const adjustFrozenColumnRightDistance = (): void => {
  rightDistanceFrozenColumn.value =
    (tableWrapper.value?.scrollWidth ?? 0) -
    (tableWrapper.value?.offsetWidth ?? 0) -
    (tableWrapper.value?.scrollLeft ?? 0) -
    (rowSingleActionCell.value?.offsetWidth ?? 0);
};

const updateTotalRecordBulkAction = (total?: number): void => {
  const disabledCount =
    (currentPageDisabledRows.value.length || props.totalDisabledRows) ?? 0;

  const data = {
    total: ((props.lazy ? total : props.data?.length) ?? 0) - disabledCount,
    tableName: props.tableName,
  };

  eventBus.emit('data-table:update-total-record', data);
};

const listenUpdateTableEvent = (): void => {
  eventBus.on('data-table:update', handleUpdateTableEvent);
};
</script>

<!-- eslint-disable vue/html-indent -->
<template>
  <div v-bind="Preset?.root">
    <div v-bind="Preset?.tablewrapper" ref="tableWrapper">
      <div v-bind="Preset?.scrollheightwrapper({ props })">
        <table :id="dataTableID" v-bind="Preset?.table" :key="tableKey">
          <thead v-bind="Preset.thead">
            <tr v-bind="Preset.headerrow">
              <th
                v-if="reorderable && !sortOrder"
                v-bind="Preset.headercellreorderable"
                :class="headerCellPreset().class"
              />
              <th
                v-if="selectionType === 'checkbox'"
                v-bind="Preset.headercellcheckbox"
                :class="headerCellPreset().class"
                @click="toggleAllDataSelection(!isSelectedAll)"
              >
                <Checkbox
                  v-bind="
                    Preset?.headercheckbox({ context: { isSelectedAll } })
                  "
                  :model-value="isSelectedAll"
                  binary
                />
              </th>

              <th
                v-if="treeTable"
                v-bind="Preset.headertoggler"
                :class="headerCellPreset().class"
              >
                <Button
                  @click="toggleExpandAll"
                  v-bind="
                    Preset.headertogglerbutton({ context: { isExpandedAll } })
                  "
                  icon="arrow-down"
                  text
                />
              </th>

              <th
                :key="col.field"
                v-for="col in visibleColumns"
                :class="[col.headerClass, col.class]"
                v-bind="headerCellPreset(col)"
                @click="col.sortable ? sortColumn(col.field, $event) : null"
              >
                <span v-bind="Preset.headercellcontent">
                  {{ col.header }}

                  <Icon
                    v-if="col.sortable"
                    :icon="
                      !sortBy || sortBy != col.field
                        ? 'arrow-up-down'
                        : sortOrder == 1
                          ? 'sort-asc'
                          : 'sort-desc'
                    "
                    class="text-base"
                  />
                </span>
              </th>

              <th
                v-bind="headerCellPreset(undefined, props.customColumn)"
                :id="`column-visibility-toggle-${dataTableID}`"
                v-if="props.customColumn || props.useOption"
                :style="`right: ${rightDistanceFrozenColumn}px`"
                @click="customColumn?.toggleMenu"
              >
                <Icon
                  v-if="props.customColumn"
                  v-bind="Preset.columnvisibilityicon"
                  icon="ellipsis-h"
                  tooltip-pos="left"
                />
              </th>
            </tr>
          </thead>

          <tbody v-if="!loadingTable" v-bind="Preset?.tbody">
            <template
              :key="index"
              v-for="(item, index) in currentPageTableData"
            >
              <tr
                :id="item._id"
                :draggable="draggable(item)"
                v-bind="
                  Preset?.bodyrow({
                    context: {
                      highlighted: item[highlightKey],
                      selected: isRowSelected(item[dataKey]),
                      disabled: isRowDisabled(item[dataKey]),
                      draggable: draggable(item),
                      dragging,
                    },
                    props,
                  })
                "
                @click="toggleRowSelection($event, item, index)"
                @dblclick="treeTable ? toggleRowExpand(item, index) : null"
                @drag="dragging = true"
                @dragenter.prevent="onDragEnter($event, item)"
                @dragleave.prevent=""
                @dragover.prevent=""
                @dragstart="startReorderRow($event, item, index)"
                @drop="onRowReorder"
              >
                <td v-if="reorderable && !sortOrder" v-bind="Preset?.bodycell">
                  <Icon
                    v-if="!item.childRow && !item.childRowHeader"
                    class="draggableicon"
                    icon="dragable-menu"
                  />
                </td>

                <td
                  v-if="selectionType === 'checkbox'"
                  v-bind="Preset?.bodycell"
                  @click.stop=""
                >
                  <Checkbox
                    v-if="!item.childRow && !item.childRowHeader"
                    v-bind="Preset?.rowcheckbox"
                    v-model="checkboxSelection"
                    :disabled="isRowDisabled(item[dataKey])"
                    :value="item"
                  />
                </td>

                <td
                  v-if="treeTable"
                  v-bind="Preset?.bodycell"
                  @click="
                    (e) => {
                      (item.childRow || item.childRowHeader) &&
                        e.stopPropagation();
                    }
                  "
                >
                  <Button
                    v-if="item.children?.length || item.hasChildren"
                    @click.stop="toggleRowExpand(item, index)"
                    v-bind="
                      Preset.rowtogglerbutton({
                        context: {
                          isRowExpanded: isRowExpanded(item[dataKey]),
                        },
                      })
                    "
                    icon="arrow-down"
                    text
                  />
                </td>

                <template
                  v-if="
                    (() =>
                      item.childRowHeader &&
                      props.childTableProps?.useColumnsHeader)()
                  "
                >
                  <td
                    :key="col.header"
                    v-for="col in visibleChildTableColumns"
                    :class="[Preset?.bodycell.class, 'font-semibold text-xs']"
                    :colspan="col.colspan ?? col.parentColumnsFields?.length"
                    @click.stop=""
                  >
                    {{ col.header }}
                  </td>
                </template>

                <td
                  v-else-if="item.childRowHeader"
                  v-bind="Preset.childrowheader"
                  :class="Preset?.bodycell.class"
                  :colspan="props.columns.length + 1"
                  @click.stop=""
                >
                  {{ item.header }}
                </td>

                <td
                  v-else-if="item.loadingRow"
                  :class="Preset?.bodycell.class"
                  :colspan="props.columns.length + 1"
                  @click.stop=""
                >
                  <div v-bind="Preset.loadingtablewrapper">
                    <DotLottieVue
                      :src="loadingTableLottie"
                      v-bind="Preset.loadingtablelottie"
                      autoplay
                      loop
                    />
                  </div>
                </td>

                <td
                  v-else-if="item.noDataRow"
                  :class="Preset?.bodycell.class"
                  :colspan="props.columns.length + 1"
                  @click.stop=""
                >
                  <div v-bind="Preset.nodatalottiewrapper">
                    <DotLottieVue
                      :src="noDataLottie"
                      v-bind="Preset.nodatalottie"
                      autoplay
                      loop
                    />
                  </div>
                </td>

                <template v-else>
                  <td
                    :key="col.field"
                    v-for="col in item.childRow
                      ? visibleChildTableColumns
                      : visibleColumns"
                    :class="[
                      {
                        '!py-0': col.editable,
                        '!px-0': col.preset?.type === 'multirow',
                      },
                      typeof col.bodyClass === 'function'
                        ? col.bodyClass(item)
                        : col.bodyClass,
                      col.class,
                    ]"
                    :colspan="col.colspan ?? col.parentColumnsFields?.length"
                    v-bind="Preset?.bodycell"
                  >
                    <template v-if="col.preset?.type === 'toggle'">
                      <InputSwitch
                        v-model="item[col.field]"
                        :disabled="
                          isRowDisabled(item[dataKey]) || col.preset?.disabled
                        "
                        :input-id="item[dataKey]"
                        @click.stop=""
                        @update:model-value="
                          async (e) => {
                            (col.preset as ColumnTogglePreset)?.onToggle?.(
                              e,
                              item,
                              () => (item[col.field] = !item[col.field]),
                            );

                            if (
                              (col.preset as ColumnTogglePreset)
                                ?.confirmDialogProps
                            ) {
                              const { showWhen } = (
                                col.preset as ColumnTogglePreset
                              )?.confirmDialogProps;

                              if (typeof showWhen === 'function') {
                                showConfirmToggle[item[dataKey]] =
                                  await showWhen(item);
                              } else {
                                showConfirmToggle[item[dataKey]] =
                                  !showWhen ||
                                  (showWhen === 'active' && e) ||
                                  (showWhen === 'inactive' && !e);
                              }
                            }
                          }
                        "
                      />

                      <DialogConfirm
                        v-if="col.preset?.confirmDialogProps"
                        :list="[item]"
                        :visible="!!showConfirmToggle[item[dataKey]]"
                        @close="
                          () => {
                            const revert = () =>
                              (item[col.field] = !item[col.field]);

                            if (
                              (col.preset as ColumnTogglePreset)
                                ?.confirmDialogProps?.actionable == false
                            ) {
                              (col.preset as ColumnTogglePreset)?.onConfirm?.(
                                item[col.field],
                                item,
                                revert,
                              );
                            } else revert();
                          }
                        "
                        @confirm="
                          col.preset?.onConfirm?.(
                            item[col.field],
                            item,
                            () => (item[col.field] = !item[col.field]),
                          )
                        "
                        @update:visible="
                          showConfirmToggle[item[dataKey]] = $event
                        "
                        actionable
                        v-bind="col.preset?.confirmDialogProps"
                      />
                    </template>

                    <template v-else-if="col.preset?.type === 'multirow'">
                      <MultiRow
                        :attributes="col.preset?.fieldAttributes(item)"
                      />
                    </template>

                    <template v-else-if="col.editable">
                      <span
                        v-bind="Preset.celleditableelement"
                        :contenteditable="col.editable"
                        @blur="
                          (e: Event) => {
                            $emit('cellEdited', {
                              item,
                              field: col.field,
                              index,
                              value: (e.target as HTMLElement).innerText,
                            } as DataTableCellEditedEvent);
                          }
                        "
                      >
                        {{ getNestedProperyValue(item, col.field) || '-' }}
                      </span>
                    </template>

                    <template
                      v-else-if="
                        col.bodyComponent || col.bodyClass || col.bodyTemplate
                      "
                    >
                      <component
                        :is="col.bodyComponent!(item, index).component"
                        v-if="col.bodyComponent"
                        v-model="col.bodyComponent!(item, index).model"
                        :disabled="col.bodyComponent!(item, index).disabled"
                        v-bind="col.bodyComponent!(item, index).props"
                        v-on="
                          col.bodyComponent!(item, index).events
                            ? col.bodyComponent!(item, index).events
                            : {}
                        "
                        @change="
                          col.bodyComponent!(item, index).onChange?.(item)
                        "
                        @click.stop=""
                        @update:model-value="
                          col.bodyComponent!(item, index).onChange?.(item)
                        "
                      />

                      <span v-else>
                        <template v-if="col.bodyTemplate">
                          {{ col.bodyTemplate?.(item, index) || '-' }}
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

                  <td
                    ref="rowSingleActionCell"
                    v-if="
                      (() =>
                        ((useOption || customColumn) && !item.childRow) ||
                        (item.childRow &&
                          (childTableProps as ChildTableProps)?.useOption))()
                    "
                    v-bind="
                      Preset?.rowsingleactioncell({
                        props,
                        context: {
                          selected: isRowSelected(item[dataKey]),
                          highlighted: item[highlightKey],
                        },
                      })
                    "
                    :class="Preset.bodycell.class"
                    :style="`right: ${rightDistanceFrozenColumn}px`"
                  >
                    <div
                      v-if="
                        useOption ||
                        (childTableProps as ChildTableProps)?.useOption
                      "
                      v-bind="Preset.singleactionwrapper"
                    >
                      <Button
                        :id="'button-action-' + item[props.dataKey]"
                        v-bind="Preset.singleactionbutton({ props })"
                        :disabled="disableAllRows"
                        @click.stop="toggleOptions($event, item)"
                        icon="ellipsis-h"
                        outlined
                        severity="secondary"
                        size="small"
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
      </div>

      <template v-if="!loadingTable && !currentPageTableData?.length">
        <div v-bind="Preset.nodatalottiewrapper">
          <DotLottieVue
            :src="noDataLottie as string"
            v-bind="Preset.nodatalottie"
            autoplay
            loop
          />
        </div>
      </template>

      <template v-if="loadingTable">
        <div v-bind="Preset.loadingtablewrapper">
          <DotLottieVue
            :src="loadingTableLottie as string"
            v-bind="Preset.loadingtablelottie"
            autoplay
            loop
          />
        </div>
      </template>
    </div>

    <Paginator
      :key="tableKey"
      v-if="usePaginator"
      v-show="!loadingTable"
      v-model:rows="tableRows"
      v-bind="Preset.paginator({ context: { totalRecords } })"
      :rows-per-page-options="rowsPerPageOptions"
      :total-records="totalRecords"
      @page="handlePageChange"
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
      :model="options"
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

    <Toast group="download" />
  </div>
</template>
