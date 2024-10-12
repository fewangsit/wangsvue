import { GenericObject } from 'vee-validate';
import { Slot } from 'vue';
import { FormPayload, FormProps } from '../form/Form.vue.d';
import { WangsIcons } from '../icon/Icon.vue.d';
import { ClassComponent, GlobalComponentConstructor } from '../ts-helpers';

export type DialogFormValue =
  | string
  | string[]
  | number
  | number[]
  | boolean
  | boolean[]
  | Record<string, unknown>
  | Record<string, unknown>[];

/**
 * Generic form payload, able to receive types from outside
 */
export type DialogFormPayload<
  FormValuesType = Record<string, DialogFormValue>,
> = {
  stayAfterSubmit: boolean;
  formValues: FormValuesType;
};

/**
 * Props for DialogForm component
 */
export interface DialogFormProps extends FormProps {
  /**
   * The template for form buttons.
   */
  buttonsTemplate: ('clear' | 'submit' | 'cancel')[];
  /**
   * The dialog header.
   */
  header: string;
  /**
   * Value binding to show/hide the dialog.
   */
  visible: boolean;

  /**
   * Determine the button label for form.
   */
  actionLabel?: string;
  /**
   * With in pixel
   *
   * @default 260
   */
  asideRightWidth?: number;
  class?: string | string[];
  /**
   * Custom button cancel label.
   */
  cancelBtnLabel?: string;
  /**
   * Custom button clear label.
   */
  clearBtnLabel?: string;
  /**
   * Wether show the Close icon or not.
   */
  closable?: boolean;
  /**
   * Close dialog after form validated and submitted.
   *
   * @default true
   */
  closeOnSubmit?: boolean;
  /**
   * @deprecated
   */
  contentClass?: string | string[];
  /**
   * Show Date time on header.
   */
  dateHeader?: string;
  /**
   * Set the header icon left beside of the title.
   */
  headerIcon?: WangsIcons;
  /**
   * Sets the invalid state.
   *
   * @default false
   */
  invalid?: boolean;
  /**
   * Prevent form resets after submitted. Default is resetted.
   *
   * @default true
   */
  resetAfterSubmit?: boolean;
  /**
   * The severity of the dialog.
   * The severity will determine the dialog icons and color scheme.
   */
  severity?: 'success' | 'danger' | 'primary';
  /**
   * Show or hide the checkbox 'Stay after submit.'
   *
   * @default true - if the action is submit.
   * @default false - if the action is save.
   */
  showStayCheckbox?: boolean;
  /**
   * Custom label for stay checkbox.
   */
  stayCheckboxLabel?: string;
  /**
   * Custom button submit label.
   */
  submitBtnLabel?: string;
  /**
   * Define the invalid message to be shown on invalid state above the Form submit button.
   *
   * @default undefined
   */
  validatorMessage?: string;
  /**
   * Additional validation function.
   * Within this this function, you need to set the invalid props value.
   *
   * If after executing this function the props invalid is true, the form will not be submitted.
   * Otherwise, 'submit' event will be emitted.
   */
  validationFunction?: () => void | Promise<void>;
  /**
   * Set the dialog size.
   *
   * - small: 400px
   * - medium: 500px
   * - large: 572px
   * - semi-xlarge: 600px
   * - xlarge: 800px
   *
   * @default 'small';
   */
  width?: 'small' | 'medium' | 'large' | 'semi-xlarge' | 'xlarge';
}

export interface ConfirmSlots {
  /**
   * The Visible state.
   */
  visible: boolean;
  /**
   * Hide the confirm dialog.
   */
  hide: () => void;
  /**
   * The submit function to be called after confirmation.
   */
  submit: (submitFn: (value: FormPayload) => Promise<void> | void) => void;
}

export interface ActionSlots {
  /**
   * The submit function to be called after confirmation.
   */
  submit: (submitFn: () => Promise<void> | void) => void;
}

/**
 * Slots for DialogForm component
 */
export interface DialogFormSlots {
  /**
   * Slot for action buttons.
   */
  'actionButtons': Slot<ActionSlots>;
  /**
   * Slot for aside right expansion.
   */
  'aside-right': Slot;
  /**
   * Slot for dialog confirm.
   */
  'confirm': Slot<ConfirmSlots>;
  /**
   * The fields slot for the Dialogform. Here is where you can put your Dialogform fields.
   */
  'fields': Slot<{ formValues: GenericObject; key?: number }>;
  /**
   * Slot for dialog header.
   */
  'header': Slot;
}

/**
 * Emits for DialogForm component
 */
export type DialogFormEmits = {
  /**
   * Emits when 'Clear Field' button clicked.
   */
  'clear': [];
  /**
   * When dialog is closed by close button.
   */
  'close': [];
  /**
   * Callback to invoke when dialog is hidden.
   */
  'hide': [];
  /**
   * Callback to invoke when dialog is shown.
   */
  'show': [];
  /**
   * Emits when the form validation succes and props.invalid is 'false'.
   */
  'submit': [values: DialogFormPayload];
  /**
   * When dialog is closed.
   */
  'update:visible': [state: boolean];
};

/**
 * **WangsVue - DialogForm**
 *
 * _DialogForm is combination of Form and Dialog. Handles validation on submit using vee-validate.
 * You need to install vee-validate while using this component._
 *
 * --- ---
 * ![WangsVue](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group components
 */
declare class DialogForm extends ClassComponent<
  DialogFormProps,
  DialogFormSlots,
  DialogFormEmits
> {
  /**
   * Exposed function to clears the form fields.
   */
  clearField: () => void;
  /**
   * The ref of form element.
   */
  form: HTMLFormElement;
}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    DialogForm: GlobalComponentConstructor<DialogForm>;
  }
}

export default DialogForm;
