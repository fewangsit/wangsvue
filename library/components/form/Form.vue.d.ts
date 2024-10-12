import { FieldContext, FieldState, GenericObject } from 'vee-validate';
import { Ref, Slot } from 'vue';
import { CheckboxModelValue } from '../checkbox/Checkbox.vue.d';
import {
  ClassComponent,
  GlobalComponentConstructor,
  Nullable,
} from '../ts-helpers';

export type Condition =
  | 'empty'
  | 'exceed'
  | 'invalidFormat'
  | 'exist'
  | 'mismatch';

export type CustomValidation = Partial<Record<Condition, string>>;

type FieldValue =
  | Nullable<string>
  | Nullable<number>
  | string
  | string[]
  | number
  | number[]
  | boolean
  | undefined
  | null
  | object;

export type FieldValidation<T = FieldValue | undefined> =
  | {
      value: T;
      errorMessage?: Ref<string | undefined>;
      setErrors?: (errors?: string | string[]) => void;
      handleReset?: () => void;
      validate?: () => void;
    }
  | (Omit<FieldContext, 'value'> & {
      value: T;
    });

export type FormValue = Record<string, unknown> | Record<string, unknown>[];

/**
 * Generic form payload, able to receive types from outside
 */
export type FormPayload<FormValuesType = Record<string, FormValue>> = {
  stayAfterSubmit: boolean;
  formValues: FormValuesType;
};

/**
 * Props for Form component
 */
export interface FormProps {
  /**
   * The template for form buttons.
   */
  buttonsTemplate?: ('clear' | 'submit' | 'cancel')[];
  /**
   * Custom button cancel label.
   */
  cancelBtnLabel?: string;
  /**
   * Custom button clear label.
   */
  clearBtnLabel?: string;
  /**
   * The number of columns per row.
   * @default 1;
   */
  columnPerRow?: number;
  /**
   * Determines whether form footer should be hidden or not
   */
  hideFooter?: boolean;
  /**
   * Determines if the stay checkbox should be hidden.
   */
  hideStayCheckbox?: boolean;
  /**
   * Invalid form state.
   */
  invalid?: boolean;
  /**
   * Prevent form resets after submitted. Default behaviour is form resetted after submit.
   *
   * @default true
   */
  resetAfterSubmit?: boolean;
  /**
   * Custom button submit label.
   */
  submitBtnLabel?: string;
  /**
   * Custom label for stay checkbox.
   */
  stayCheckboxLabel?: string;
  /**
   * Custom submit form validator message.
   */
  validatorMessage?: string;
}

/**
 * Slots for Form component
 */
export interface FormSlots {
  /**
   * The fields slot for the form. Here is where you can put your form fields.
   */
  fields: Slot<{ formValues: GenericObject; key?: number }>;
}

/**
 * Emits for Form component
 */
export type FormEmits = {
  /**
   * Emitted when button template `Cancel` clicked (doesn't matter its label)
   */
  cancel: [];
  /**
   * Emitted when button template `Clear` clicked (doesn't matter its label)
   */
  clear: [];
  /**
   * Emitted when button template `Submit` clicked (doesn't matter its label)
   */
  submit: [values: FormPayload];
};

/**
 * **WangsVue - Form**
 *
 * _Form is a component for creating forms with validation on submit using vee-validate.
 * You need to install vee-validate while using this component._
 *
 * --- ---
 * ![WangsVue](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group components
 */
declare class Form extends ClassComponent<FormProps, FormSlots, FormEmits> {
  /**
   * Exposed errors of form
   */
  errors: Partial<Record<string, string>>;
  /**
   * The ref of form element.
   */
  formElement: HTMLFormElement;
  /**
   * Whether to show validator or not
   */
  showValidator: boolean;
  /**
   * Whether to keep the dialog remains visible or not after submit.
   */
  stayAfterSubmit: CheckboxModelValue;
  /**
   * Exposed function to clears the form fields.
   */
  clearField: () => void;
  /**
   * Exposed function to clears the specific field.
   */
  resetField: (field: string, state?: Partial<FieldState>) => void;
  /**
   * Exposed function that handle submit inside form component
   */
  submit: (e?: Event | undefined) => Promise<void | undefined>;
}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    Form: GlobalComponentConstructor<Form>;
  }
}

export default Form;
