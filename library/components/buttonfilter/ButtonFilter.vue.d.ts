import { DefineComponent } from 'vue';

export interface ButtonFilterProps {
  /**
   * Integrate with datatable with table name
   */
  tableName?: string;
}

declare const ButtonFilter: DefineComponent<ButtonFilterProps>;

export default ButtonFilter;
