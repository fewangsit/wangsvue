import { Slot, Ref } from 'vue';
import { FieldContext, GenericObject } from 'vee-validate';
import { ClassComponent, GlobalComponentConstructor } from '../ts-helpers';
import { CheckboxModelValue } from '../checkbox/Checkbox.vue.d';

import { Nullable } from 'primevue/ts-helpers';

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

export type FormPayload<FormValuesType = Record<string, FormValue>> = {
  stayAfterSubmit: boolean;
  formValues: FormValuesType;
};

/**
 * Props for Form component
 */
export interface FormProps {
  /**
   * The number of columns per row.
   * @default 1;
   */
  columnPerRow?: number;
  /**
   * The template for form buttons.
   */
  buttonsTemplate?: ('clear' | 'submit' | 'cancel')[];
  /**
   * Custom button submit label.
   */
  submitBtnLabel?: string;
  /**
   * Custom button clear label.
   */
  clearBtnLabel?: string;
  /**
   * Determines if the stay checkbox should be hidden.
   */
  hideStayCheckbox?: boolean;
  /**
   * Prevent form resets after submitted. Default is resetted.
   *
   * @default true
   */
  resetAfterSubmit?: boolean;
  /**
   * Determines if the buttons should be sticky.
   */
  stickyButtons?: boolean;
  hideFooter?: boolean;
  /**
   * Custom submit form validator message.
   */
  validatorMessage?: string;
  /**
   * Invalid form state.
   */
  invalid?: boolean;
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
  submit: [values: FormPayload];
  clear: [];
  cancel: [];
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
   * Wether to keep the dialog remains visible or not after submit.
   */
  stayAfterSubmit: CheckboxModelValue;
  /**
   * The ref of form element.
   */
  formElement: HTMLFormElement;
  submit: (e?: Event | undefined) => Promise<void | undefined>;
  /**
   * Clears the form fields.
   */
  clearField: () => void;
}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    Form: GlobalComponentConstructor<Form>;
  }
}

export default Form;
