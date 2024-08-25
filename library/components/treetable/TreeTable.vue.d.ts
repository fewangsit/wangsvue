import {
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
  childTableProps?: Partial<TreeTableProps> & {
    /**
     * Specify the header/title for the child table
     */
    header?: string;
  };
}

export type TreeTableEmits = DataTableEmits;
