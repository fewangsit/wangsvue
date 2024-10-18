import { DefineComponent, Slot } from 'vue';
import { CustomValidation } from '../form/Form.vue.d';

export type InputNumberEvent = number | string | undefined;

/**
 * InputNumber component props
 */
export interface InputNumberProps {
  /**
   * Number modelValue of the input.
   */
  modelValue?: number;
  /**
   * Sets the initial value of the field.
   * This will only available with option 'useValidator'.
   *
   * In use case like edit form, you need to display the previous inputted value.
   */
  value?: number;
  /**
   * Existing values to be checked with validation 'exist' - check the validatorMessage props
   *
   * - Need to specify the custom validation : { empty: 'Error message when empty' } within props validatorMessage
   */
  existingValues?: number[];
  /**
   * The input label. Tell the user what input is this.
   */
  label?: string;
  /**
   * Min input number value.
   */
  min?: number;
  /**
   * Max input number value.
   */
  max?: number;
  /**
   * The maximum input length.
   *
   * @default 16 digit number
   */
  maxDigit?: number;
  /**
   * Set the pad start of value.
   *
   * Insert '0' in the front of value
   * @default 1
   */
  padStart?: number;
  /**
   * Weather the input should be validated with vee-validator or not.
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
   * Whether this input field is required or not.
   */
  mandatory?: boolean;
  /**
   * Set custom validator message.
   * Will be show if invalid="true"
   */
  validatorMessage?: string | CustomValidation;
  /**
   * Show the validator message on error.
   *
   * @default true;
   */
  showValidatorMessage?: boolean;
  /**
   * Specify the input placeholder.
   *
   * @default 'Enter {label}' or 'Enter number'
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
   * Displays increment/decrement buttons.
   */
  showButtons?: boolean;
  /**
   * The width of input.
   */
  size?: 'small' | 'normal' | 'full';
  /**
   * Defines the behavior of the component.
   * @defaultValue decimal
   */
  mode?: 'decimal' | 'currency';
  /**
   * The minimal digits of decimal value.
   */
  minFractionDigits?: number;
  /**
   * Whether to use grouping separators, such as thousands separators or thousand/lakh/crore separators.
   * @defaultValue false
   */
  useGrouping?: boolean;
  /**
   * Show information about the field.
   */
  fieldInfo?: string;
  /**
   * The filed info tooltip position
   */
  tooltipPos?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * Specify the appearance of addon right and left
   * - filled - has background and border
   * - plain - no background, no border
   *
   * @defaultValue filled
   */
  addonVariant?: 'filled' | 'plain';
  /**
   * Class to be bind on addon left component
   */
  addonLeftClass?: any;
  /**
   * Class to be bind on input group component
   */
  inputGroupClass?: any;
  /**
   * Class to be bind on input number component
   */
  inputNumberClass?: any;
  /**
   * Unique id for input number element
   */
  inputId?: string;
  /**
   * Set auto Resize Input
   * The input width is counted by the value length
   *
   * @default false
   */
  autoResize?: boolean;
  /**
   * Allow input to have value null or undefined.
   * If it sets to 'false', when the value is empty, it will fall back to min value if exists, zero otherwise
   *
   * @default true
   */
  allowEmptyValue?: boolean;
}

/**
 * InputNumber component emits
 */
export type InputNumberEmits = {
  /**
   * Emits when the input has losen focus.
   * The model value is the valid value from given min and max number.
   *
   * If the inputed number is above max, return the max. And vice versa.
   */
  'update:modelValue': [payload?: number];
  /**
   * If you need to check validation, you can use this events.
   */
  'input': [payload?: number];
};

export interface InputNumberSlots {
  'addon-left': Slot;
  'addon-right': Slot;
}

/**
 * **WangsVue - InputNumber**
 *
 * _Handle input number with form validation._
 *
 * --- ---
 * ![WangsVue](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group form
 */
declare const InputNumber: DefineComponent<
  InputNumberProps,
  InputNumberEmits,
  InputNumberSlots
>;

export default InputNumber;
