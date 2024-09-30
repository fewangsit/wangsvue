import { Slot } from 'vue';
import { FormPayload, FormProps } from '../form/Form.vue.d';
import { ClassComponent, GlobalComponentConstructor } from '../ts-helpers';
import { GenericObject } from 'vee-validate';
import { WangsIcons } from '../icon/Icon.vue.d';

export type DialogFormValue =
  | string
  | string[]
  | number
  | number[]
  | boolean
  | boolean[]
  | Record<string, unknown>
  | Record<string, unknown>[];

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
   * Value binding to show/hide the dialog.
   */
  visible: boolean;
  /**
   * The dialog header.
   */
  header: string;
  /**
   * Show Date time on header
   */
  dateHeader?: string;
  /**
   * Determine the button label for form.
   */
  actionLabel?: string;
  /**
   * Show or hide the checkbox 'Stay after submit'
   *
   * @default true - if the action is submit.
   * @default false - if the action is save.
   */
  showStayCheckbox?: boolean;
  /**
   * The template for form buttons.
   */
  buttonsTemplate: ('clear' | 'submit' | 'cancel')[];
  /**
   * Custom button submit label.
   */
  submitBtnLabel?: string;
  /**
   * Custom button clear label.
   */
  clearBtnLabel?: string;
  /**
   * Prevent form resets after submitted. Default is resetted.
   *
   * @default true
   */
  resetAfterSubmit?: boolean;
  /**
   * Close dialo after form validated and submited.
   *
   * @default true
   */
  closeOnSubmit?: boolean;
  /**
   * Wether show the Close icon or not.
   */
  closable?: boolean;
  /**
   * Define the invalid message to be shown on invalid state above the Form submit button.
   *
   * @default undefined
   */
  validatorMessage?: string;
  /**
   * Sets the invalid state.
   *
   * @default false
   */
  invalid?: boolean;
  /**
   * Additional validation function.
   * Within this this function, you need to set the invalid props value.
   *
   * If after executing this function the props invalid is true, the form will not submitted.
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
  class?: string | string[];
  contentClass?: string | string[];
  /**
   * Set the header icon left beside of the title.
   */
  headerIcon?: WangsIcons;
  /**
   * The severity of the dialog.
   * The severity will determine the dialog icons and color scheme.
   */
  severity?: 'success' | 'danger' | 'primary';
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
   * The fields slot for the Dialogform. Here is where you can put your Dialogform fields.
   */
  'fields': Slot<{ formValues: GenericObject; key?: number }>;
  /**
   * Slot for dialog confirm.
   */
  'confirm': Slot<ConfirmSlots>;
  /**
   * Slot for aside right expansion.
   */
  'aside-right': Slot;
  /**
   * Slot for dialog header.
   */
  'header': Slot;
  /**
   * Slot for action buttons.
   */
  'actionButtons': Slot<ActionSlots>;
}

/**
 * Emits for DialogForm component
 */
export type DialogFormEmits = {
  /**
   * When dialog is closed.
   */
  'update:visible': [state: boolean];
  /**
   * When dialog is closed by close button.
   */
  'close': [];
  /**
   * Emits when the form validation succes and props.invalid is 'false'.
   */
  'submit': [values: DialogFormPayload];
  /**
   * Emits when 'Clear Field' button clicked.
   */
  'clear': [];
  /**
   * Callback to invoke when dialog is shown.
   */
  'show': [];
  /**
   * Callback to invoke when dialog is hidden.
   */
  'hide': [];
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
> {}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    DialogForm: GlobalComponentConstructor<DialogForm>;
  }
}

export default DialogForm;
