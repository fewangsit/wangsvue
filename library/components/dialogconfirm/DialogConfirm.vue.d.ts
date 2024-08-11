import { DefineComponent, Slot } from 'vue';
import { TSVueIcons } from 'v2/Icon/Icon.vue.d';

type ConfirmDialogSeverity = 'success' | 'danger';

/**
 * Props for DialogConfirm component
 */
export interface DialogConfirmProps {
  /**
   * The header of the dialog.
   */
  header: string;
  /**
   * Custom header icon. Default is 'error' icon for danger severity, and 'cehckbox-circle' for success severity.
   */
  headerIcon?: TSVueIcons;
  /**
   * The severity of the dialog.
   * The severity will determine the dialog icons and color scheme.
   */
  severity: ConfirmDialogSeverity;
  /**
   * The label of the confirm button.
   * @default 'Yes, Continue'
   */
  confirmLabel?: string;
  /**
   * The lists to be displayed in the dialog.
   */
  list?: (string | object)[] | Set<string | object>;
  /**
   * The label of the list if your list item is an object.
   * Choose a property from the item to be displayed on the list.
   */
  listLabel?: string;
  /**
   * The confirmation message.
   */
  message?: string;
  /**
   * Determines if the dialog should close after confirm.
   * @default true
   */
  closeAfterConfirm?: boolean;
  /**
   * To hide/show the confirm button.
   *
   * Set to 'false' Make the confirm dialog cannot be confirmed.
   *
   * @default true;
   */
  actionable?: boolean;
  /**
   * Wether show icon header or not.
   * @default true;
   */
  showIcon?: boolean;
}

/**
 * Slots for DialogConfirm component
 */
export interface DialogConfirmSlots {
  /**
   * The body slot for the dialog. Here is where you can put your dialog body.
   */
  body?: Slot | string;
  /**
   * The footer slot for the dialog. Here is where you can put your dialog footer.
   * Use this slot if you need to custom the dialog buttons.
   */
  footer?: Slot | string;
}

/**
 * Emits for DialogConfirm component
 */
export type DialogConfirmEmits = {
  /**
   * Emits when Confirm button clicked.
   */
  'confirm': [];
  /**
   * Emits when the dialog is closed. Wether from cancel button, close button, or ESC button pressed.
   */
  'update:visible': [state: boolean];
};

/**
 * **TSVue - DialogConfirm**
 *
 * _DialogConfirm is a component for creating confirmation dialogs._
 *
 * --- ---
 * ![TSVue](https://ik.imagekit.io/kurniadev/TS-HEAD-BLACK.png)
 *
 * @group components
 */
declare const DialogConfirm: DefineComponent<
  DialogConfirmProps,
  DialogConfirmSlots,
  DialogConfirmEmits
>;

export default DialogConfirm;
