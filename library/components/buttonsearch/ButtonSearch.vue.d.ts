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
 * **WangsVue - ButtonSearch**
 *
 * _Search button with searchbox for table._
 *
 * --- ---
 * ![WangsVue](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group form
 */
declare const ButtonSearch: DefineComponent<
  ButtonSearchProps,
  ButtonSearchEmits
>;

export default ButtonSearch;
