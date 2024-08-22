import { DefineComponent } from 'vue';

/**
 * InputPhoneNumber component props
 */
export interface InputPhoneNumberProps {
  /**
   * ModelValue of the input.
   */
  modelValue?: string;
  /**
   * Sets the initial value of the field.
   * This will only available with option 'useValidator'.
   *
   * In usecase like edit form, you need to display the previous inputted value.
   */
  value?: string;
  /**
   * The input label. Tell the user what input is this.
   */
  label?: string;
  /**
   * Specify the input placeholder.
   *
   * @default 'Enter phone number'
   */
  placeholder?: string;
  /**
   * Disabled the input.
   */
  disabled?: boolean;
  /**
   * State of invalid input.
   */
  invalid?: boolean;
  /**
   * Wether the input should be validated with vee-validator or not.
   * If you use this component within form input, you need to set this props as true.
   */
  useValidator?: boolean;
  /**
   * This prop is required if you use this component in a form input.
   * Specify the unique field name, match with your needs for API request.
   *
   * @default 'numberInput'
   */
  fieldName?: string;
  /**
   * Wether this input field is required or not.
   */
  mandatory?: boolean;
  /**
   * Set the custom validator message.
   * By default each field has preserved with its validator message, you don't need to worrying about the message.
   */
  validatorMessage?: string;
  /**
   * Show information about the field.
   */
  fieldInfo?: string;
}

/**
 * InputPhoneNumber component emits
 */
export type InputPhoneNumberEmits = {
  /**
   * Emits when the input already filled.
   */
  'update:modelValue': [value?: string];
};

/**
 * **WangsVue - InputPhoneNumber**
 *
 * _Handle input number with form validation._
 *
 * --- ---
 * ![WangsVue](https://ik.imagekit.io/kurniadev/TS-HEAD-BLACK.png)
 *
 * @group form
 */
declare const InputPhoneNumber: DefineComponent<
  InputPhoneNumberProps,
  InputPhoneNumberEmits,
  Record<string, unknown>
>;

export default InputPhoneNumber;
