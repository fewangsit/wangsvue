import { DefineComponent } from 'vue';
import { Nullable } from '../ts-helpers';
import { CustomValidation } from '../form/Form.vue.d';

/**
 * InputInitialName component props
 */
export interface InputInitialNameProps {
  /**
   * Model value for the input field
   */
  modelValue?: Nullable<string>;
  /**
   * Initial value for field validation
   */
  value?: Nullable<string>;
  /**
   * Pass the full name to automaticaly formatted to initial name
   */
  fullName?: string;
  /**
   * A list of initital names to be compared with new inputed
   */
  existingInitialNames: string[];
  maxLength?: number;
  /**
   * Label for the input field
   */
  label?: string;

  /**
   * Specify classes for label
   */
  labelClass?: string;

  /**
   * Field name for the input field
   */
  fieldName?: string;

  /**
   * Set manual invalid input container state.
   */
  manualInvalidContainer?: boolean;

  /**
   * Determines if the field is mandatory
   */
  mandatory?: boolean;

  /**
   * Determines if the field uses a validator
   */
  useValidator?: boolean;

  /**
   * Validator message for the input field
   */
  validatorMessage?: string | CustomValidation;

  /**
   * Classes for validator message in input field
   */
  validatorMessageClass?: string;

  /**
   * Placeholder for the input field
   */
  placeholder?: string;

  /**
   * Determines if the input field is disabled
   */
  disabled?: boolean;

  /**
   * Show information to user about the field.
   */
  fieldInfo?: string;

  /**
   * Specify classes for input
   */
  inputClass?: string;

  /**
   * Specify classes for input container
   */
  inputContainerClass?: string;
}

/**
 * InputInitialName component emits
 */
export type InputInitialNameEmits = {
  /**
   * Event emitted when the model value is updated
   */
  'update:modelValue': [payload?: Nullable<string>];
  'blur': [payload?: Nullable<string>];
};
/**
 * **WangsVue - InputInitialName**
 *
 * _Handle input email with form validation._
 *
 * --- ---
 * ![WangsVue](https://ik.imagekit.io/kurniadev/TS-HEAD-BLACK.png)
 *
 * @group form
 */
declare const InputInitialName: DefineComponent<
  InputInitialNameProps,
  InputInitialNameEmits
>;

export default InputInitialName;
