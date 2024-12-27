import { Slot } from 'vue';
import { WangsIcons } from '../icon/Icon.vue.d';
import { ClassComponent, GlobalComponentConstructor } from '../ts-helpers';

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
   * The severity of the dialog.
   * The severity will determine the dialog icons and color scheme.
   */
  severity: ConfirmDialogSeverity;
  /**
   * The boolean modelValue to show dialog.
   */
  visible: boolean;

  /**
   * Determines if the dialog should close after confirm.
   * @default true
   */
  closeAfterConfirm?: boolean;
  /**
   * The label of the close/cancel button.
   */
  closeLabel?: string;
  /**
   * To hide/show the confirm button.
   *
   * Set to 'false' Make the confirm dialog cannot be confirmed.
   *
   * @default true;
   */
  actionable?: boolean;
  /**
   * The label of the confirm button.
   * @default 'Yes, Continue'
   */
  confirmLabel?: string;
  /**
   * Custom header icon. Default is 'error' icon for danger severity, and 'checkbox-circle' for success severity.
   */
  headerIcon?: WangsIcons;
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
   * Whether show icon header or not.
   * @default true;
   */
  showIcon?: boolean;
  /**
   * Whether show close button or not (footer button that has label, not close button with icon 'X').
   * @default true;
   */
  showCloseButton?: boolean;
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
   * Emits when close button clicked.
   */
  'close': [];
  /**
   * Emits when Confirm button clicked.
   */
  'confirm': [];
  /**
   * Emits when dialog closed.
   */
  'hide': [];
  /**
   * Emits when the dialog is closed. Wether from cancel button, close button, or ESC button pressed.
   */
  'update:visible': [state: boolean];
};

/**
 * **WangsVue - DialogConfirm**
 *
 * _DialogConfirm is a component for creating confirmation dialogs._
 *
 * --- ---
 * ![WangsVue](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group components
 */
declare class DialogConfirm extends ClassComponent<
  DialogConfirmProps,
  DialogConfirmSlots,
  DialogConfirmEmits
> {}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    DialogForm: GlobalComponentConstructor<DialogConfirm>;
  }
}

export default DialogConfirm;
