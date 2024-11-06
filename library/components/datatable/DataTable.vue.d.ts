import { DialogConfirmProps } from 'lib/components/dialogconfirm/DialogConfirm.vue.d';
import { MenuItem } from 'lib/components/menuitem';
import { ClassComponent, HintedString } from 'lib/components/ts-helpers';
import { Component } from 'vue';

export type ChildGroup = {
  groupHeader: string;
  groupItems: Data[];
};

export type Data = Record<string, any> & {
  children?: ChildGroup[];
  hasChildren?: boolean;
};

export type QueryParams = {
  [key: string]: any;
};

/**
 * Custom sort event.
 * @see {@link BaseDataTableEmits.sort}
 */
export interface DataTableSortEvent {
  /**
   * Browser event.
   */
  originalEvent: Event;
  /**
   * Index of first record
   */
  first: number;
  /**
   * Number of rows to display in new page
   */
  rows: number;
  /**
   * Field to sort against
   */
  sortField: string | undefined;
  /**
   * Sort order as integer
   */
  sortOrder: 1 | 0 | -1 | undefined | null;
  /**
   * Collection of active filters
   * @see DataTableFilterMeta
   */
  filters: DataTableFilterMeta;
  /**
   * Match modes per field
   */
  filterMatchModes:
    | HintedString<
        | 'startsWith'
        | 'contains'
        | 'notContains'
        | 'endsWith'
        | 'equals'
        | 'notEquals'
        | 'in'
        | 'lt'
        | 'lte'
        | 'gt'
        | 'gte'
        | 'between'
        | 'dateIs'
        | 'dateIsNot'
        | 'dateBefore'
        | 'dateAfter'
      >
    | undefined;
}

/**
 * Custom pagination event.
 * @see {@link BaseDataTableEmits.page}
 * @extends DataTableSortEvent
 */
export interface DataTablePageEvent extends DataTableSortEvent {
  /**
   * New page number
   */
  page: number;
  /**
   * Total page count
   */
  pageCount: number;
}

/**
 * Custom datatable operator filter metadata.
 */
export interface DataTableOperatorFilterMetaData {
  /**
   * Filter operator
   */
  operator: string;
  /**
   * Array of filter meta data.
   */
  constraints: DataTableFilterMetaData[];
}

/**
 * Custom datatable filter metadata.
 */
export interface DataTableFilterMetaData {
  /**
   * Filter value
   */
  value: any;
  /**
   * Filter match mode
   */
  matchMode:
    | HintedString<
        | 'startsWith'
        | 'contains'
        | 'notContains'
        | 'endsWith'
        | 'equals'
        | 'notEquals'
        | 'in'
        | 'lt'
        | 'lte'
        | 'gt'
        | 'gte'
        | 'between'
        | 'dateIs'
        | 'dateIsNot'
        | 'dateBefore'
        | 'dateAfter'
      >
    | undefined;
}

/**
 * Custom datatable filter metadata.
 */
export interface DataTableFilterMeta {
  /**
   * Extra options
   */
  [key: string]:
    | string
    | DataTableFilterMetaData
    | DataTableOperatorFilterMetaData;
}

export type FetchResponse<T = Data> = {
  message: string;
  data: {
    data: T[];
    totalRecords: number;
  };
};

export type ShortFetchResponse<T = Data> = {
  message: string;
  data: T[];
};

export type TableCellComponent = {
  component: Component;
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
   * @param revertFunction - function to revert previous state when action failed or canceled
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
  disabled?: boolean;
}

export interface ColumnMultiRowPreset {
  type: 'multirow';
  fieldValues?: (data: any) => string[];
}

export type ColumnPreset = ColumnTogglePreset | ColumnMultiRowPreset;

export interface TableColumn {
  header?: string;
  field: string;
  editable?: boolean;
  sortable?: boolean;
  /**
   * Whether the column can be re-ordered by column visibility.
   * If set to false, the column will not appear on column visibility.
   */
  reorderable?: boolean;
  /**
   * Make the column cannot reordered by disabled drag-ability.
   */
  dragable?: boolean;
  fixed?: boolean;
  visible?: boolean;
  /**
   * Use commonly used component as preset
   */
  preset?: ColumnPreset;
  /**
   * Whether the column is checked by default, only for Custom Report Table
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
   * The Excel result will only get the property object which the value is truthy.
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
  bodyTemplate?: (data: any, index: number) => string | undefined;
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
}

/**
 * Extending the base table column, tree table column will only available when props.treeTable is sets to be `true`
 */
export interface TreeTableColumns extends TableColumn {
  /**
   * How much the column spanning
   */
  colspan?: number;
  /**
   * The list of parents columns fields
   * The colspan will be counted from it lengths
   * This column will be shown when at least one of parent columns is visible
   *
   * @example
   * This column spans from parent column A to C,
   * this property value should be ['a', 'b', 'c'],
   * which each value in array is a 'column.field' of the parent columns
   *
   * The counted colspan will be 3
   */
  parentColumnsFields?: string[];
}

/**
 * Emit payload for `cellEdited`
 */
export interface DataTableCellEditedEvent {
  item: Data;
  field: string;
  index: number;
  value?: string;
}

/**
 * Emit payload for `rowReorder`
 */
export interface DataTableRowReorderEvent {
  item: Data;
  fromIndex?: number;
  toIndex?: number;
}

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

export type ChildTableProps = Partial<Omit<TreeTableProps, 'fetchFunction'>> & {
  /**
   * Use the header of each column in child table
   *
   * @default false
   */
  useColumnsHeader?: boolean;
  /**
   * The function to fetch data on row expand
   */
  fetchFunction?: (parentData: Data) => Promise<ShortFetchResponse | undefined>;
};

export interface TreeTableProps extends Omit<BaseDataTableProps, 'columns'> {
  /**
   * Activate tree table mode
   */
  treeTable?: true;
  /**
   * V-model single selection. Works with selectionType 'single'
   */
  singleSelection?: Data;
  /**
   * An array of table columns to display.
   */
  columns: TreeTableColumns[];
  /**
   * Properties to be passed into sub table
   */
  childTableProps?: ChildTableProps;
}

export interface BaseDataTableProps {
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
   * Whether show single action option.
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
   * The key of the data object to determine whether the row data should be disabled.
   */
  disableKey?: string;
  /**
   * Boolean to specify whether all rows should be disabled.
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
   * Sets to lazy if you need to dynamically shows data.
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
   * Whether display pagination under the table or not.
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
   * Whether the column is customizable or not.
   *
   * @default true - the table is able to reorder and toggle visibility column;
   */
  customColumn?: boolean;
  /**
   * Props to set scroll height, this will make table content scrollable
   * @example '50vh' or '300px'
   */
  scrollHeight?: string;
  /**
   * When the row height sets to fixed, it will have 35px height
   *
   * @defaultValue 'fixed'
   */
  rowHeight?: 'fixed' | 'auto';
  /**
   * To determine if row table is reorder-able
   */
  reorderable?: boolean;
  /**
   * An array of fields as string to use in global filtering.
   */
  globalFilterFields?: string[];
  /**
   * Total disabled rows in table (used for synchronizing with bulk action button)
   */
  totalDisabledRows?: number;
  /**
   * Specify the error message download excel
   */
  excelToastErrorMessage?: string;
}

export type DataTableProps = BaseDataTableProps | TreeTableProps;

export type BaseDataTableEmits = {
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

export type TreeTableEmits = BaseDataTableEmits & {
  /**
   * Emitted when a row is clicked/selected. Only available on `single` selectionType
   */
  'update:singleSelection': [data: Data];
  /**
   * Emitted when cell has lost focus.
   */
  'cellEdited': [payload: DataTableCellEditedEvent];
  /**
   * @deprecated - use new emits `cellEdited`
   */
  'input': [payload: DataTableCellEditedEvent];
  /**
   * Emitted on Drop Event occurred after dragging a row.
   * Only available on
   *
   */
  'rowReorder': [payload?: DataTableRowReorderEvent];
};

export type DataTableEmits = BaseDataTableEmits | TreeTableEmits;

/**
 * **WangsVue - DataTable**
 *
 *  * _DataTable displays data in tabular format._
 *
 * [Live Demo](https://fewangsit.github.io/wangsvue/table)
 * --- ---
 * ![WangsVue](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group Component
 */
declare class DataTable extends ClassComponent<
  DataTableProps,
  Record<string, unknown>,
  DataTableEmits
> {}

export default DataTable;
