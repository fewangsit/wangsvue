import { Component } from 'vue';
import { MenuItem } from '../menuitem';
import { ClassComponent } from '../ts-helpers';
import {
  DataTableFilterMeta,
  DataTablePageEvent,
  DataTableSortEvent,
} from 'primevue/datatable';
import { DialogConfirmProps } from '../dialogconfirm/DialogConfirm.vue.d';

export type ChildGroup = {
  groupHeader: string;
  groupItems: Data[];
};

export type Data = Record<string, any> & {
  children?: ChildGroup[];
};

export type QueryParams = {
  [key: string]: any;
};

export type FetchResponse<T = Data> = {
  message: string;
  data: {
    data: T[];
    totalRecords: number;
  };
};

export type TableCellComponent = {
  component: string | Component;
  props?: object;
  model?: any;
  events?: any;
  onChange?: (itemData: any) => void;
  disabled?: boolean;
};

export interface ColumnTogglePreset {
  type: 'toggle';
  /**
   *
   * @param state boolean - the toggle state
   * @param revertFunction - function to revert previous state when action failed
   * @returns
   */
  onToggle?: (state: boolean, data: Data, revertFunction: () => void) => void;
  /**
   * Use dialog confirmation
   */
  confirmDialogProps?: Omit<
    DialogConfirmProps,
    'visible' | 'list' | 'onConfirm'
  > & {
    /**
     * When the dialog should be shown? On toggle active or inactive
     *
     * Pass a boolean returning function to show dialog when it returns true
     *
     * @default both - leave this as undefined to show on both state
     */
    showWhen?:
      | 'active'
      | 'inactive'
      | ((data: Data) => boolean)
      | ((data: Data) => Promise<boolean>);
  };
  onConfirm?: (state: boolean, data: Data, revertFunction: () => void) => void;
}

export type ColumnPreset = ColumnTogglePreset;

export type TableColumn = {
  header?: string;
  field: string;
  editable?: boolean;
  sortable?: boolean;
  /**
   * Wether the column can be re-ordered by column visibilty.
   * If set to false, the column will not appear on column visibility.
   */
  reorderable?: boolean;
  /**
   * Make the column cannot reordered by disabled dragability.
   */
  dragable?: boolean;
  fixed?: boolean;
  visible?: boolean;
  /**
   * Use commontly used component as preset
   */
  preset?: ColumnPreset;
  /**
   * Wether the column is checked by default, only for Custom Report Table
   * @default true
   */
  checkedByDefault?: boolean;
  /**
   * The column width in pixel.
   */
  width?: number | string;
  /**
   * Exclude column from download/export excel.
   */
  excluded?: boolean;
  /**
   * Set the field for Export Excel, when you need to export different field of column field.
   *
   * @default undefined - the export field using column 'field'
   */
  exportField?: string;
  /**
   * Specify the header when exported
   */
  exportHeader?: string;
  /**
   * Specify the property or field which value in the array should be used for exporting to Excel.
   *
   * @example 'field.name.fullName'
   */
  arrayValueField?: string;
  /**
   * Download Excel Config
   *
   * When needs to export only the property has Truthy value, set this to true,
   * The excel result will only get the property object which the value is truthy.
   *
   * @example
   * Example Object:
   * "roles": {
   *    roleA: true,
   *    roleB: true,
   *    roleC: false,
   *    roleD: null, // falsy
   *    roleE: '', // falsy
   *    roleF: 'role', // truthy
   * }
   *
   * The result will be: "roleA, roleB, roleF" - Only the properties with truthy values will be included.
   */
  includeTruthyProperties?: boolean;
  /**
   * Convert boolean into text Yes/No
   */
  booleanValue?: boolean;
  bodyTemplate?: (data: any) => string | undefined;
  bodyComponent?: (data: any) => TableCellComponent;
  headerTemplate?: () => string;
  headerComponent?: () => {
    component: string | Component;
    props?: any;
    model?: any;
    events?: any;
    onChange?: (data: any) => void;
    disabled?: boolean;
  };
  /**
   * Inline style of header, body and footer cells.
   */
  style?: string | (() => string);
  /**
   * Style class of header, body and footer cells.
   */
  class?: string | string[] | (() => string | string[]);
  /**
   * Inline style of the column header.
   */
  headerStyle?: string | (() => string);
  /**
   * Style class of the column header.
   */
  headerClass?: string | string[] | (() => string | string[]);
  /**
   * Inline style of the column body.
   */
  bodyStyle?: string | (() => string);
  /**
   * Style class of the column body.
   */
  bodyClass?: string | string[] | ((data?: any) => string | string[]);
};

export type TableOption = {
  label?: string;
  command?: (data?: any) => any;
  icon?: string;
  items?: any[];
  class?: string;
  disabled?: boolean;
  separator?: boolean;
  danger?: boolean;
  visible?: boolean;
};

/**
 * Custom row click event.
 * @see {@link DataTableEmits['row-click']}
 */
export interface DataTableRowClickEvent {
  /**
   * Browser event.
   */
  originalEvent: Event;
  /**
   * Selected row data.
   */
  data: any;
  /**
   * Row index.
   */
  index: number;
}

/**
 * Custom row select all change event.
 * @see {@link DataTableEmits['select-all-change']}
 */
export interface DataTableSelectAllChangeEvent {
  /**
   * Browser event
   */
  originalEvent: Event;
  /**
   * Whether all data is selected.
   */
  checked: boolean;
}

export interface DataTableProps {
  /**
   * Optional property to set a unique name for the table. This name will be used as part of the unique table ID.
   *
   * @optional
   */
  tableName?: string;
  /**
   * An array of table columns to display.
   */
  columns: TableColumn[];
  /**
   * Wether show single action option.
   * @default true;
   */
  useOption?: boolean;
  /**
   * An array of objects to display in the table.
   */
  data?: Data[];
  /**
   * The key of the data object to use as a unique identifier.
   *
   * @default '_id'
   */
  dataKey?: string;
  /**
   * The key of the data object to determine wether the row data should be disabled.
   */
  disableKey?: string;
  /**
   * Boolean to specify wether all rows should be disabled.
   */
  disableAllRows?: boolean;
  /**
   * The query search from ButtonSearch component.
   */
  search?: string;
  /**
   * Tag query for search by scan
   */
  tag?: string;
  /**
   * The default query params that must be included every fetch request.
   */
  defaultQueryParams?: Readonly<Record<string, any>>;
  /**
   * The function to fetch data on DataTable mounted and on queryParams dependencies updated.
   *
   * @param params this is required
   */
  fetchFunction?: (params: QueryParams) => Promise<FetchResponse | undefined>;
  /**
   * The number of rows to display per page.
   * @defaultValue 5
   */
  rows?: number;
  /**
   * Whether all rows are selected or not.
   */
  isSelectedAll?: boolean;
  filters?: DataTableFilterMeta;
  /**
   * Determine the type of DataTable.
   *
   * Sets to lazy if you need to dynamicaly shows data.
   */
  lazy?: boolean;
  loading?: boolean;
  /**
   * Whether to enable 'checkbox' | 'single' selection.
   *
   * @default 'checkbox'
   */
  selectionType?: 'single' | 'checkbox' | 'none';
  /**
   * Whether to enable checkbox multi-selection.
   *
   * @deprecated use 'selection-type="checkbox"'
   */
  useSelection?: boolean;
  /**
   * An array of selected objects from `data`.
   */
  selectedData?: Data[];
  /**
   * An array of selected objects from `data`.
   */
  expandedRows?: { [key: string]: boolean };
  /**
   * Wether display pagination under the table or not.
   */
  usePaginator?: boolean;
  /**
   * The options that will be visible for each row data.
   *
   * __Provide at least one option to display an Options Menu for each row.__
   *
   * The options menu will be displayed on the right side of the table row.
   */
  options?: MenuItem[];
  /**
   * Whether to enable single selection or not.
   * If enabled, clicking a row will trigger the `rowSelect` event with the corresponding data object passed as a parameter.
   *
   * @deprecated use 'selection-type="single"'
   * @note Do not combine `singleSelect` with `useSelection`, as it may lead to unexpected behavior.
   */
  singleSelect?: boolean;
  /**
   * Wether the column is customizable or not.
   *
   * @default true - the table is able to reorder and toggle visibility column;
   */
  customColumn?: boolean;
  /**
   * Set the scrollHeight in px
   */
  scrollHeight?: string;
  /**
   * An array of fields as string to use in global filtering.
   */
  globalFilterFields?: string[];
  /**
   * Total disabled rows in table (used for synchronizing with bulk action button)
   */
  totalDisabledRows?: number;
  /**
   * Sepecify the error message download excel
   */
  excelToastErrorMessage?: string;
}

export type DataTableEmits = {
  /**
   * Emits when option menu button clicked.
   */
  'toggleOption': [data: Data];
  /**
   * @deprecated use 'v-model:selected-data' instead.
   */
  'selectData': [data: Data[]];
  'rowSelect': [data: DataTableRowClickEvent];
  /**
   * Event emitted when the `isSelectedAll` property is updated.
   *
   * @event update:isSelectedAll
   * @param {boolean} data - The updated value of `isSelectedAll`.
   *
   * @example
   * <DataTable v-model:is-selected-all="isSelectedAll" />
   *
   * This will update the `isSelectedAll` value when one of checkbox is unchecked.
   *
   * @deprecated;
   */
  // 'update:isSelectedAll': [data: boolean];
  /**
   * Event emitted when the page changes in the data table.
   *
   * @event page
   * @param {DataTablePageEvent} data - The event data containing information about the new page.
   *
   * @example
   * <DataTable @page="handlePageChange" />
   *
   * This will call the `handlePageChange` method whenever the page changes in the data table.
   */
  'page': [data: DataTablePageEvent];

  /**
   * Event emitted when the sort order changes in the data table.
   *
   * @event sort
   * @param {DataTableSortEvent} data - The event data containing information about the new sort order.
   *
   * @example
   * <DataTable @sort="handleSortChange" />
   *
   * This will call the `handleSortChange` method whenever the sort order changes in the data table.
   */
  'sort': [data: DataTableSortEvent];
  /**
   * Event emitted when the `selectedData` property is updated.
   *
   * @event update:selectedData
   * @param {Data[]} datas - The updated array of selected data objects.
   *
   * @example
   * <DataTable v-model:selected-data="selectedData" />
   *
   * This will update the `selectedData` value whenever a row is selected or deselected.
   */
  'update:selectedData': [datas: Data[]];
};

declare class DataTable extends ClassComponent<
  DataTableProps,
  Record<string, unknown>,
  DataTableEmits
> {}

export default DataTable;
