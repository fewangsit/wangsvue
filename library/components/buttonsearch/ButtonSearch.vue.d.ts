/* eslint-disable @typescript-eslint/no-empty-interface */
import { DefineComponent } from 'vue';

export type ButtonSearchEmits = {
  /**
   * Emits when the Enter key is pressed.
   */
  search: [payload?: string];
  /**
   * Emits when the search box is hidden by clicking the left arrow button.
   * The 'search' query parameter should be reset to undefined when this event is emitted.
   */
  collapsed: [];
};

export interface ButtonSearchProps {
  tableName?: string;
}

/**
 * **TSVue - ButtonSearch**
 *
 * _Search button with searchbox for table._
 *
 * --- ---
 * ![TSVue](https://ik.imagekit.io/kurniadev/TS-HEAD-BLACK.png)
 *
 * @group form
 */
declare const ButtonSearch: DefineComponent<
  ButtonSearchProps,
  ButtonSearchEmits
>;

export default ButtonSearch;
