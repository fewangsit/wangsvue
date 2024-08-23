import { DefineComponent } from 'vue';
import { Nullable } from '../ts-helpers';
import { CustomValidation } from '../form/Form.vue.d';

/**
 * InputEmail component props
 */
export interface InputEmailProps {
  /**
   * Model value for the input field
   */
  modelValue?: Nullable<string>;

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
 * InputEmail component emits
 */
export type InputEmailEmits = {
  /**
   * Event emitted when the model value is updated
   */
  'update:modelValue': [payload?: Nullable<string>];
  'blur': [payload?: Nullable<string>];
};
/**
 * **WangsVue - InputEmail**
 *
 * _Handle input email with form validation._
 *
 * --- ---
 * ![WangsVue](https://ik.imagekit.io/kurniadev/TS-HEAD-BLACK.png)
 *
 * @group form
 */
declare const InputEmail: DefineComponent<InputEmailProps, InputEmailEmits>;

export default InputEmail;
