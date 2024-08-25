<script setup lang="ts">
import {
  computed,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
  shallowRef,
} from 'vue';

import PrimeDataTable, {
  DataTableSelectAllChangeEvent,
  DataTablePageEvent,
  DataTableSortEvent,
  DataTableRowClickEvent,
  DataTableExpandedRows,
} from 'primevue/datatable';

import {
  DataTableProps,
  DataTableEmits,
  FetchResponse,
  TableColumn,
} from './DataTable.vue.d';

import { DownloadEvent } from '../../custom-events.d';
import { filterVisibleMenu } from '../helpers';
import { exportToExcel, getNestedProperyValue, useToast } from 'lib/utils';
import { FilterMatchMode, FilterService } from 'primevue/api';

import Icon from 'lib/components/icon/Icon.vue';
import Column from 'primevue/column';
import Menu from 'lib/components/menu/Menu.vue';
import CustomColumn from '../customcolumn/CustomColumn.vue';
import CustomColumnInstance from '../customcolumn/CustomColumn.vue.d';
import useDataTableStore from './store/dataTable.store';
import Checkbox from '../checkbox/Checkbox.vue';
import CheckboxPreset from 'lib/preset/checkbox';
import Button from '../button/Button.vue';
import MenuClass from '../menu/Menu.vue.d';
import { Booleanish } from '../ts-helpers';
import Toast from '../toast/Toast.vue';
import { cloneDeep } from 'lodash';
import eventBus, { TableEvent } from 'lib/event-bus';

type Data = Record<string, any>;
type QueryParams = {
  [key: string]: any;
};

const props = withDefaults(defineProps<DataTableProps>(), {
  selectionType: 'checkbox',
  defaultQueryParams: undefined,
  selectedData: undefined,
  totalRecords: undefined,
  options: undefined,
  filters: undefined,
  search: undefined,
  data: undefined,
  customColumn: true,
  rows: 10,
  tableName: 'datatable',
  disableKey: '',
  useOption: true,
  childrenUseOption: true,
  childrenDataKey: '_id',
  childrenFilters: undefined,
  dataKey: '_id',
});

const emit = defineEmits<DataTableEmits>();

const expandedRows = defineModel<DataTableExpandedRows>('expandedRows');

onMounted(async () => {
  if (props.fetchFunction) {
    await refetch();
    listenUpdateTableEvent();
  }

  if (!props.lazy) dispatchUpdateTotalRecordsEvent();

  listenDownloadEvent();
  listenFetchAllDataEvent();

  registerCustomFilter();
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
      dataSelected.value = [];
    }
  });
});

onBeforeUnmount(() => {
  removeDownloadEventListener();
  removeFetchAllDataEventListener();
  removeUpdateTableListener();
  eventBus.off('data-table:apply-filter');
  eventBus.off('search-table');
  eventBus.off('data-table:clear-selected-data');
});

const toast = useToast();
const rowsPerPageOptions = ref([10, 25, 50, 100]);
const optionMenu = ref<MenuClass | null>(null);
const currentPageDataSelected = ref<Data[]>();
const dataSelected = shallowRef<Data[]>(props.selectedData ?? []);
const columnKey = shallowRef(0);

const selectionMode = computed(() => {
  switch (props.selectionType) {
    case 'single':
      return 'single';
    case 'checkbox':
      return 'multiple';
    default:
      return undefined;
  }
});

/**
 * This computed variable determines wether the selection checkbox on header should be checked or not.
 * When select all data from bulkaction, the currentPageTableData value should not be updated.
 * The 'isSelectedAll' will be true if either the all current page data is selected or all records selected.
 */
const isSelectedAll = computed(() => {
  if (
    props.disableAllRows ||
    !currentPageTableData.value?.length ||
    props.selectionType !== 'checkbox'
  )
    return false;

  const length = dataSelected.value?.length;

  const currentPageDataKey =
    filterDisabledRows(currentPageTableData.value)?.map(
      (dt) => dt[props.dataKey],
    ) ?? [];

  const selectedDataKey =
    dataSelected.value?.map((dt) => dt[props.dataKey]) ?? [];

  const isCurrentPageAllDataSelected = selectedDataKey.length
    ? isArrayIncluded(currentPageDataKey, selectedDataKey)
    : false;

  const isAllRecordSelected =
    length ===
    (totalRecords.value ?? 0) - (currentPageDisabledRows.value.length ?? 0);

  return isCurrentPageAllDataSelected || isAllRecordSelected;
});

const globalFilterFields = computed(() =>
  props.lazy ? undefined : props.columns.map((column) => column.field),
);

const singleOptions = computed(() => {
  return filterVisibleMenu(props.options ?? []);
});

/**
 * Extended Functionality
 * - Handle Search
 * - Handle Sorting
 * - Handle Pagination
 * - Handle Filter
 * - Handle Select All
 */

const dataTable = ref<typeof PrimeDataTable>();

/**
 * Store the data list for the first page only.
 * Cannot have length more than the row limit, it will result unexpected result.
 */
const currentPageTableData = defineModel<Data[]>('tableData');
const tablePage = ref<number>(1);
const tableRows = ref<number>(props.rows ?? 10);
const sortOrder = ref<DataTableSortEvent['sortOrder']>();
const sortField = ref<DataTableSortEvent['sortField']>();

const tableKey = ref<number>(0);
const customColumnKey = ref<number>(0);
const totalRecords = ref<number>();
const loadingTable = ref<boolean>(false);
// Stores filter from event bus FilterContainer
const filterQueryParams = shallowRef<QueryParams>({});
const searchQueryParam = shallowRef<string>();

const queryParams = computed<QueryParams>(() => ({
  ...props.defaultQueryParams,
  search: props.lazy ? searchQueryParam.value : props.search,
  page: props.usePaginator ? tablePage.value : undefined,
  limit: props.usePaginator ? tableRows.value : undefined,
  sortOrder: sortOrder.value,
  sortBy: sortField.value,
  ...(props.lazy ? filterQueryParams.value : props.filters), // This will resets the previous filters.
}));

const isArrayIncluded = (
  smallArray: string[],
  largeArray: string[],
): boolean => {
  return smallArray.every((element) => largeArray.includes(element));
};

/**
 * This function resets data table-specific query parameters (page, limit, sortBy, sortOrder) back to their default value.
 */
const resetSortQuery = (): void => {
  sortField.value = undefined;
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

const registerCustomFilter = (): void => {
  FilterService.register('ONE_OF_ARRAY', (value, filterModel) => {
    if (filterModel === undefined || filterModel === null) {
      return true;
    }

    if (value === undefined || value === null) {
      return false;
    }

    const filterred = value.filter((val: string) => filterModel.includes(val));

    return !!filterred.length;
  });
};

/**
 * Update total records on bulkaction.
 */
const dispatchUpdateTotalRecordsEvent = (total?: number): void => {
  const disabledCount =
    (currentPageDisabledRows.value.length || props.totalDisabledRows) ?? 0;

  const data = {
    total: ((props.lazy ? total : props.data?.length) ?? 0) - disabledCount,
    tableName: props.tableName,
  };

  eventBus.emit('data-table:update-total-record', data);
};

/**
 * Used in export excel and event listener from Bulkaction select all data.
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

const refetch = async (): Promise<void> => {
  try {
    loadingTable.value = true;
    const response = await props.fetchFunction?.(queryParams.value);

    const { data, totalRecords: total = 0 } = response?.data ?? {};
    dispatchUpdateTotalRecordsEvent(total);
    currentPageTableData.value = data;
    totalRecords.value = total;
    loadingTable.value = false;

    nextTick(disableRowClick);
  } catch (error) {
    console.error('🚀 ~ refetch ~ error:', error);
  }
};

/**
 * When user select rows limit option higher than the current row, the pagination reset to one.
 * Otherwise, the pagination should change to where the first row data is after rows limit change.
 */
const handlePageChange = (event: DataTablePageEvent): void => {
  emit('page', event);
  tableRows.value = event.rows;
  tablePage.value = event.page + 1;

  refetch();
};

/**
 * On sorting:
 * - Maintain the limit
 * - Resets the pagination.
 */
const handleSortTable = (event: DataTableSortEvent): void => {
  emit('sort', event);
  sortField.value = event.sortField;
  sortOrder.value = event.sortOrder;

  resetPage();
  refetch();
};

/**
 * Select All data (Only Select Data on Current Page)
 */
const onSelectAllChange = (event: DataTableSelectAllChangeEvent): void => {
  const filteredRows = filterDisabledRows(currentPageTableData.value);
  currentPageDataSelected.value = event.checked
    ? JSON.parse(JSON.stringify(filteredRows))
    : [];

  if (!props.lazy) dispatchUpdateTotalRecordsEvent();

  dataSelected.value = event.checked ? filteredRows : [];
};

const onRowToggleSelectAll = (): void => {
  if (!props.lazy) dispatchUpdateTotalRecordsEvent();
};

const onRowClick = (event: DataTableRowClickEvent): void => {
  emit('rowSelect', event);
};

const onUnselectData = (data: Data): void => {
  currentPageDataSelected.value = currentPageDataSelected.value?.filter(
    (dt) => dt[props.dataKey] !== data[props.dataKey],
  );
  if (!props.lazy) dispatchUpdateTotalRecordsEvent();
};

const onSelectData = (eventData: Data): void => {
  currentPageDataSelected.value?.push(eventData);
  if (!props.lazy) dispatchUpdateTotalRecordsEvent();
};

const updateCurrentPageSelection = (event: Event, rowData: Data): void => {
  const isChecked = (event.target as HTMLInputElement)?.checked;
  if (isChecked) onSelectData(rowData);
  else onUnselectData(rowData);
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

const handleUpdateTableEvent = (event: TableEvent): void => {
  if (!event.tableName || event.tableName === props.tableName) {
    nextTick(() => {
      columnKey.value++;
      refetch();
    }); // Waits untill computed queryparams ready
  }
};

const downloadEventHandler = (event: DownloadEvent): void => {
  const { fileName, tableName } = event.detail;
  downloadExcel(fileName, tableName);
};

const listenDownloadEvent = (): void => {
  window.addEventListener('downloadExcel', downloadEventHandler);
};

const removeDownloadEventListener = (): void => {
  window.removeEventListener('downloadExcel', downloadEventHandler);
};

const listenFetchAllDataEvent = (): void => {
  window.addEventListener('fetchAllData', fetchAllDataHandler);
};

const removeFetchAllDataEventListener = (): void => {
  window.removeEventListener('fetchAllData', fetchAllDataHandler);
};

const listenUpdateTableEvent = (): void => {
  eventBus.on('data-table:update', handleUpdateTableEvent);
};

const removeUpdateTableListener = (): void => {
  eventBus.off('data-table:update');
};

const fetchAllDataHandler = (event: CustomEvent<string>): void => {
  selectAllData(event);
};

/**
 * Handle select all data from bulk action.
 */
const selectAllData = async (event: CustomEvent<string>): Promise<void> => {
  if (props.tableName !== event.detail) return;

  try {
    loadingTable.value = true;
    if (props.lazy) {
      const { data, totalRecords: total = 0 } = await fetchAllData();

      const disabledRows = getDisabledRows(data);
      dataSelected.value = filterDisabledRows(data, disabledRows);

      dispatchUpdateTotalRecordsEvent(total);
    } else {
      const disabledRows = getDisabledRows(props.data);
      dataSelected.value = filterDisabledRows(props.data, disabledRows);

      dispatchUpdateTotalRecordsEvent(props.data?.length);
    }
  } finally {
    loadingTable.value = false;
  }
};

watch(() => props.search, handleFilter);
watch(() => props.filters, handleFilter);

const customColumn = ref<CustomColumnInstance>();
const dataTableID = ref<string>('');

(function setTableID(): void {
  const path = window.location.pathname.replace('/', '').split('/').join('-');
  const tableId = `${path}-${props.tableName}`;

  dataTableID.value = tableId;
})();

const visibleColumns = ref<TableColumn[]>(props.columns);

/**
 * Disable row feature
 */

const currentPageDisabledRows = computed(() =>
  getDisabledRows(props.data ?? currentPageTableData.value ?? []),
);

const getDisabledRows = (tableData: Data[] | undefined = []): string[] => {
  if (props.disableAllRows) return tableData.map((data) => data[props.dataKey]);
  return tableData
    .filter((data) => data[props.disableKey])
    .map((data) => data[props.dataKey]);
};

const disableRowClick = (): void => {
  const dataTableElement = document.getElementById(
    dataTableID.value,
  ) as HTMLDivElement;

  const rows =
    dataTableElement?.querySelector('tbody')?.querySelectorAll('tr') ?? [];

  currentPageDisabledRows.value.forEach((rowID) => {
    const index = (props.data ?? currentPageTableData.value ?? []).findIndex(
      (data) => data[props.dataKey] === rowID,
    );

    if (index !== -1 && rows[index]) {
      rows[index].style.pointerEvents = 'none';
    }
  });
};

watch(
  () => props.disableAllRows,
  (is) => {
    const dataTableElement = document.getElementById(
      dataTableID.value,
    ) as HTMLDivElement;

    const rows =
      dataTableElement?.querySelector('tbody')?.querySelectorAll('tr') ?? [];

    rows.forEach((row) => {
      row.style.pointerEvents = is ? 'none' : 'auto';
    });

    window.dispatchEvent(
      new CustomEvent('disableBulkAction', {
        detail: {
          tableName: props.tableName,
          value: is,
        },
      }),
    );
  },
);

const filterDisabledRows = (
  tableData: Data[] | undefined,
  rowsIDs?: string[],
): Data[] => {
  return (tableData ?? []).filter(
    (data) =>
      !(rowsIDs ?? currentPageDisabledRows.value).includes(data[props.dataKey]),
  );
};

// Static Filtering
const staticFilters = computed(() =>
  props.lazy ? undefined : matchModes.value,
);

const matchModes = computed(() => ({
  global: { value: props.search, matchMode: FilterMatchMode.CONTAINS },
  ...props.filters,
}));

const adjustMenuPosition = (event: Event): void => {
  let el = event.target as HTMLElement;

  if (el.tagName === 'UL') {
    el = el.parentElement as HTMLElement;
  }

  const { offsetHeight = 0 } = el;
  const maxHeight = (window.innerHeight * 90) / 100;

  if (offsetHeight >= maxHeight) {
    el.style.transform = 'translateY(5vh)'; // Make the menu verticaly centered
  }
};

const updateTableColumnsWidth = async (): Promise<void> => {
  const table = document.getElementById(dataTableID.value);

  if (table) {
    const cols = table.querySelectorAll<HTMLElement>(
      'th[data-ts-resizable-column=true]',
    );

    const columnConfig = visibleColumns.value.map((column) => {
      const colElement = Array.from(cols).find(
        (el) => el.getAttribute('data-ts-column-field') === column.field,
      );

      return {
        field: column.field,
        visible: column.visible !== false,
        fixed: !!column.fixed,
        width: colElement
          ? getComputedStyle(colElement).width
          : (column.width ?? 'max-content'),
      };
    });

    const { setConfig } = await useDataTableStore();
    await setConfig(dataTableID.value, columnConfig);
  }
};

const getColumnStyle = (col: TableColumn): string => {
  const computedWidth =
    typeof col.width === 'number'
      ? col.width + 'px'
      : (col.width ?? 'max-content');

  return `width: ${computedWidth}; max-width: ${computedWidth}`;
};

const downloadExcel = async (
  fileName: string,
  tableName: string,
): Promise<void> => {
  if (tableName !== props.tableName) return;

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
    // Loading Here

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
          const objectValue = (fieldValue ?? {}) as Record<string, Booleanish>;

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

    exportToExcel({
      headers,
      data: excelBody,
      fileName: formatFileName(),
    });
  } catch (error) {
    console.error(error);
    toast.removeAllGroups();
    toast.add({
      message: props.excelToastErrorMessage ?? 'Data gagal diunduh.',
      error,
      group: 'download',
    });
  } finally {
    // Stop Loading here
  }
};

const firstColumn = (field: string): boolean => {
  return props.columns.findIndex((col) => col.field === field) === 0;
};

watch(
  () => props.columns,
  () => {
    customColumnKey.value++;
  },
);

watch(dataSelected, (newSelectedData: Data[]) => {
  emit('selectData', newSelectedData);
  emit('update:selectedData', newSelectedData);

  eventBus.emit('data-table:update-selected-data', {
    tableName: props.tableName,
    data: newSelectedData,
  });
});
</script>

<template>
  <PrimeDataTable
    :id="dataTableID"
    :key="tableKey"
    ref="dataTable"
    v-model:expanded-rows="expandedRows"
    v-model:filters="staticFilters"
    v-model:selection="dataSelected"
    :data-key="props.dataKey"
    :global-filter-fields="props.globalFilterFields ?? globalFilterFields"
    :lazy="props.lazy"
    :loading="props.loading || loadingTable"
    :paginator="props.usePaginator"
    :rows="usePaginator ? (props.rows ?? 10) : undefined"
    :rows-per-page-options="rowsPerPageOptions"
    :scroll-height="scrollHeight"
    :select-all="props.lazy ? isSelectedAll : undefined"
    :selection-mode="selectionMode"
    :total-records="props.lazy ? totalRecords : undefined"
    :value="props.data ?? currentPageTableData"
    @column-resize-end="updateTableColumnsWidth"
    @page="handlePageChange"
    @row-click="onRowClick"
    @row-select="onSelectData($event.data)"
    @row-select-all="onRowToggleSelectAll"
    @row-unselect="onUnselectData($event.data)"
    @row-unselect-all="onRowToggleSelectAll"
    @select-all-change="onSelectAllChange"
    @sort="handleSortTable"
    current-page-report-template="Menampilkan {first} - {last} dari {totalRecords}"
    data-wv-name="TSDataTable"
    paginator-template="FirstPageLink PrevPageLink PageLinks JumpToPageInput NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    removable-sort
    resizable-columns
    scrollable
  >
    <template #empty>
      <span class="leading-[47px] text-inherit dark:text-general-50">
        No Data Found
      </span>
    </template>

    <template #loadingicon>
      <Icon
        :class="['text-xl animate-spin', { '!mt-[30px]': !usePaginator }]"
        icon="loader-4"
      />
    </template>

    <slot v-if="$slots['expander']" name="expander" />

    <Column
      v-if="selectionType === 'checkbox'"
      body-style="text-align: center"
      header-style="width: 32px"
      selection-mode="multiple"
      style="min-width: 32px !important; max-width: 32px !important"
    >
      <template #body="{ data: rowData }">
        <span
          :role="rowData.role"
          class="flex justify-center items-center"
          data-wv-section="checkboxselection"
        >
          <Checkbox
            v-if="!rowData.role?.includes('child')"
            v-model="dataSelected"
            :binary="false"
            :disabled="disableAllRows || rowData[disableKey]"
            :value="rowData"
            @change="updateCurrentPageSelection($event, rowData)"
          />
        </span>
      </template>

      <template #headercheckboxicon="{ checked }">
        <Icon
          :aria-checked="checked"
          :class="[
            ...CheckboxPreset.icon.class,
            { 'text-transparent': !checked },
          ]"
          icon="check"
        />
      </template>
    </Column>

    <Column
      :key="col.field"
      v-for="col of visibleColumns"
      v-memo="[col.visible !== false, columnKey]"
      v-bind="col"
      :body-style="
        typeof col.bodyStyle === 'function' ? col.bodyStyle() : col.bodyStyle
      "
      :class="typeof col.class === 'function' ? col.class() : col.class"
      :header-class="
        typeof col.headerClass === 'function'
          ? col.headerClass()
          : col.headerClass
      "
      :header-style="
        typeof col.headerStyle === 'function'
          ? col.headerStyle()
          : col.headerStyle
      "
      :pt="{
        root: {
          'data-ts-resizable-column': true,
          'data-ts-column-field': col.field,
        },
      }"
      :style="col.style ? col.style : getColumnStyle(col)"
    >
      <template #header v-if="col.headerComponent || col.headerTemplate">
        <template v-if="col.headerComponent">
          <component
            :is="col.headerComponent!().component"
            v-bind="col.headerComponent!().props"
            v-on="
              col.headerComponent!().events ? col.headerComponent!().events : {}
            "
          />
        </template>
        <template v-else-if="col.headerTemplate">
          {{ col.headerTemplate }}
        </template>
      </template>

      <template #sorticon="{ sorted, sortOrder: order }">
        <Icon
          :key="sortOrder?.toString()"
          :icon="
            !sorted ? 'arrow-up-down' : order == 1 ? 'sort-desc' : 'sort-asc'
          "
          class="text-base"
        />
      </template>

      <template #body="{ data: itemData, field }">
        <template v-if="itemData.role === 'childheader'">
          <template v-if="firstColumn(field)">{{ itemData.header }}</template>
        </template>
        <template v-else>
          <template
            v-if="col.bodyComponent || col.bodyClass || col.bodyTemplate"
          >
            <component
              :is="col.bodyComponent!(itemData).component"
              v-if="col.bodyComponent"
              v-model="col.bodyComponent!(itemData).model"
              :disabled="col.bodyComponent!(itemData).disabled"
              v-bind="col.bodyComponent!(itemData).props"
              v-on="
                col.bodyComponent!(itemData).events
                  ? col.bodyComponent!(itemData).events
                  : {}
              "
              @change="col.bodyComponent!(itemData).onChange?.(itemData)"
              @update:model-value="
                col.bodyComponent!(itemData).onChange?.(itemData)
              "
            />

            <span
              v-else
              :class="
                typeof col.bodyClass === 'function'
                  ? col.bodyClass(itemData)
                  : col.bodyClass
              "
            >
              <template v-if="col.bodyTemplate">
                {{ (col.bodyTemplate && col.bodyTemplate(itemData)) || '-' }}
              </template>
              <template v-else>
                {{ getNestedProperyValue(itemData, col.field) || '-' }}
              </template>
            </span>
          </template>

          <template v-else>
            {{ getNestedProperyValue(itemData, field) ?? '-' }}
          </template>
        </template>
      </template>
    </Column>

    <Column
      v-if="useOption || props.customColumn"
      align-frozen="right"
      class="w-[35px]"
      frozen
    >
      <template #header v-if="props.customColumn">
        <Icon
          @click="customColumn?.toggleMenu"
          class="!w-4 !h-4 !mx-auto"
          icon="ellipsis-h"
          info="Visibilitas Kolom"
          tooltip-pos="left"
        />
      </template>
      <template #body="{ data: itemData }" v-if="useOption">
        <div
          class="relative w-full h-full flex items-center justify-center"
          data-wv-section="single-action-wrapper"
        >
          <Button
            :id="'button-action-' + itemData[props.dataKey]"
            :class="[
              {
                'pointer-events-none !border-general-100 [&>i]:text-general-200':
                  disableAllRows,
              },
              { 'pointer-events-auto': !disableAllRows },
            ]"
            :disabled="disableAllRows"
            @click.stop="toggleOptions($event, itemData)"
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
      </template>
    </Column>

    <template #expansion="{ data }" v-if="$slots['expansion']">
      <slot :data="data" name="expansion" />
    </template>

    <template #paginatorfirstpagelinkicon="{ class: iconClass }">
      <Icon :class="iconClass" icon="round-keyboard-double-arrow-left" />
    </template>

    <template #paginatorlastpagelinkicon="{ class: iconClass }">
      <Icon :class="iconClass" icon="round-keyboard-double-arrow-right" />
    </template>

    <template #paginatorprevpagelinkicon="{ class: iconClass }">
      <Icon :class="iconClass" icon="round-keyboard-arrow-left" />
    </template>

    <template #paginatornextpagelinkicon="{ class: iconClass }">
      <Icon :class="iconClass" icon="round-keyboard-arrow-right" />
    </template>
  </PrimeDataTable>

  <Menu
    id="single-action-menu"
    ref="optionMenu"
    :model="singleOptions"
    @focus="adjustMenuPosition"
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
</template>

<style>
/* This style to fix bug: When pointer released after resizing, the sorting becomes active */
[data-wv-name='TSDataTable']:has(.resizer[style*='display: block']) {
  pointer-events: none;
}
</style>
