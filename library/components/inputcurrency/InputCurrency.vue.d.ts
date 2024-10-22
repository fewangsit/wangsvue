import { DefineComponent } from 'vue';

export type CurrencyFormat = {
  name?: string;
  label: string;
  currency: string;
  symbol: string;
  locale: string;
};

export interface CurrencyValue {
  currency: string; // Currency ISO Code
  value?: number;
}

/**
 * InputCurrency component props
 */
export interface InputCurrencyProps {
  /**
   * Number modelValue of the input.
   */
  modelValue?: CurrencyValue;
  /**
   * Sets the initial value of the field.
   * This will only available with option 'useValidator'.
   *
   * In usecase like edit form, you need to display the previous inputted value.
   */
  value?: number;
  /**
   * The input label. Tell the user what input is this.
   */
  label?: string;
  /**
   * Max input number value.
   */
  max?: number;
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
   * Set custom validator message.
   * It is rarely use, this component has handled the validator message.
   */
  validatorMessage?: string;
  /**
   * Custom invalid state.
   */
  invalid?: boolean;
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
   * Displays increment/decrement buttons.
   */
  showButtons?: boolean;
  /**
   * The width of input.
   */
  size?: 'small' | 'normal' | 'full';
  /**
   * Defines the behavior of the component.
   * @defaultValue currency
   */
  mode?: 'decimal' | 'currency';
  /**
   * Whether to use grouping separators, such as thousands separators or thousand/lakh/crore separators.
   * @defaultValue true
   */
  useGrouping?: boolean;
  /**
   * Show information about the field.
   */
  fieldInfo?: string;
  inputnNumberId?: string;
}

/**
 * InputCurrency component emits
 */
export type InputCurrencyEmits = {
  /**
   * Emits when the input has loosen focus.
   * The model value is the valid value from given min and max number.
   *
   * If the inputted number is above max, return the max. And vice versa.
   */
  'update:modelValue': [payload?: CurrencyValue];
  /**
   * If you need to check validation, you can use this events.
   */
  'input': [payload?: number];
};

/**
 * **WangsVue - InputCurrency**
 *
 * _Handle input Currency with form validation._
 *
 * --- ---
 * ![WangsVue](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group form
 */
declare const InputCurrency: DefineComponent<
  InputCurrencyProps,
  InputCurrencyEmits
>;

export default InputCurrency;
