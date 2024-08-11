import { TableColumn } from '../datatable/DataTable.vue.d';
import { ClassComponent } from '../ts-helpers';

export interface CustomColumnProps {
  tableId: string;
  defaultColumns: TableColumn[];
  visibleColumns: TableColumn[];
  /**
   * The maximum column count allowed
   * @default infinity
   */
  maxColumn?: number;
  type?: 'menu' | 'flat';
}

declare class CustomColumn extends ClassComponent<
  CustomColumnProps,
  unknown,
  unknown
> {
  /**
   * Method to show custom column menu.
   */
  toggleMenu: () => void;
  /**
   * Resets the column visibility to default
   */
  resetToDefault: () => void;
}

export default CustomColumn;
