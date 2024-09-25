import {
  Data,
  DataTableEmits,
  DataTableProps,
  TableColumn,
} from '../datatable/DataTable.vue.d';

interface TreeTableColumns extends TableColumn {
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

export interface EditedContent {
  item: Data;
  field: string;
  index: number;
  value?: string;
}

export interface DataTableRowReorderEvent {
  item: Data;
  fromIndex?: number;
  toIndex?: number;
}

export type ChildTableProps = Partial<TreeTableProps> & {
  /**
   * Use the header of each column in child table
   *
   * @default false
   */
  useColumnsHeader?: boolean;
};

export interface TreeTableProps extends Omit<DataTableProps, 'columns'> {
  /**
   * V-model single selection. Works with selectionType 'single'
   */
  singleSelection?: Data;
  /**
   * Activate tree table mode
   */
  treeTable?: boolean;
  /**
   * An array of table columns to display.
   */
  columns: TreeTableColumns[];
  /**
   * Properties to be passed into sub table
   */
  childTableProps?: ChildTableProps;
  /**
   * Props to set scroll height, this will make table content scrollable
   * @example '50vh' or '300px'
   */
  scrollHeight?: string;
  /**
   * To determine if row table is reorderable
   */
  reorderable?: boolean;
}

export type TreeTableEmits = DataTableEmits & {
  'update:singleSelection': [data: Data];
  'input': [payload: EditedContent];
  'rowReorder': [payload?: DataTableRowReorderEvent];
};
