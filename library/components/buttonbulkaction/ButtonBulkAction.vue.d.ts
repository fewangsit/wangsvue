/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefineComponent } from 'vue';
import { MenuItem } from '../menuitem';

export interface ButtonBulkActionProps {
  /**
   * Disable the button.
   */
  disabled?: boolean;
  /**
   * An array of data objects to be included in an action.
   * Use as 'v-model:selectedData' to automatically reset on Cancel or Apply.
   */
  selectedData: Record<string, any>[];
  /**
   * The total selectable data. This is optional when working with dynamic data table,
   * just define tableName, the component will handle the rest for you
   *
   */
  totalRecords?: number;
  options: MenuItem[];
  /**
   * Multiple bulk action mounted at the same time will cause unexpected behavior.
   *
   * You need to set the appropiate id the same with the table-name where the bulkaction used for.
   */
  tableName?: string;
}

export interface ButtonBulkActionSlots {
  /**
   * Use additional slot like input field.
   * The button Apply will shown if the selected option use additional slot.
   *
   * @slotprops selectedOption the current selected option/action. you can do conditional based on this slotprops.
   */
  addition(selectedOption: MenuItem): () => any;
}

export type ButtonBulkActionEmits = {
  /**
   * Emits when Apply button is clicked.
   *
   * By default 'command' on MenuItem will be executed.
   * With this event, You can do additional actions.
   */
  'apply': [];
  /**
   * Emits when Cancel or Apply button is clicked.
   */
  'update:selectedData': [datas: Record<string, unknown>[]];
};

/**
 * **TSVue V2 - ButtonBulkAction**
 *
 * _ButtonBulkAction is a component for handling bulk action for multiple data at once._
 *
 * --- ---
 * ![TSVue](https://ik.imagekit.io/kurniadev/TS-HEAD-BLACK.png)
 *
 * @group buttons
 */
declare const ButtonBulkAction: DefineComponent<
  ButtonBulkActionProps,
  ButtonBulkActionSlots,
  ButtonBulkActionEmits
>;

export default ButtonBulkAction;
