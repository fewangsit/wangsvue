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
}

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
  childTableProps?: Partial<TreeTableProps>;
  /**
   * Props to set scroll height, this will make table content scrollable
   * @example '50vh' or '300px'
   */
  scrollHeight?: string;
}

export type TreeTableEmits = DataTableEmits & {
  'update:singleSelection': [data: Data];
};
