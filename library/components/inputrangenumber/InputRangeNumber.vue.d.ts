import { DefineComponent } from 'vue';
import { CustomValidation } from '../form/Form.vue.d';

/**
 * InputRangeNumber component props
 */
export interface InputRangeNumberProps {
  /**
   * Number modelValue of the input.
   */
  modelValue?: number[];
  /**
   * Initial Form value.
   */
  value?: number[];
  /**
   * The input label. Tell the user what input is this.
   */
  label?: string;
  /**
   * Placeholder for both input
   *
   * @default 'Tulis'
   */
  placeholder?: string;
  /**
   * Specify the min number input placeholder.
   *
   * @default 'Tulis'
   */
  minPlaceholder?: string;
  /**
   * Specify the max number input placeholder.
   *
   * @default 'Tulis'
   */
  maxPlaceholder?: string;
  /**
   * Disabled the input.
   */
  disabled?: boolean;
  /**
   * State of invalid input.
   */
  invalid?: boolean;
  /**
   * Show the text (opsional)
   *
   * @default true if mandatory true
   */
  showOptionalText?: boolean;
  /**
   * Weather the input should be validated with vee-validator or not.
   * If you use this component within form input, you need to set this props as true.
   */
  useValidator?: boolean;
  /**
   * Whether this input field is required or not.
   */
  mandatory?: boolean;
  /**
   * Set custom validator message.
   * Will be show if invalid="true"
   */
  validatorMessage?: string | CustomValidation;
  minFieldName?: string;
  maxFieldName?: string;
}

/**
 * InputRangeNumber component emits
 */
export type InputRangeNumberEmits = {
  /**
   * Emits when the both input already filled.
   */
  'update:modelValue': [payload?: (number | undefined)[]];
  'submit': [];
};

/**
 * **WangsVUe - InputRangeNumber**
 *
 * _Handle input range number._
 *
 * --- ---
 * ![WangsVUe](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group form
 */
declare const InputRangeNumber: DefineComponent<
  InputRangeNumberProps,
  InputRangeNumberEmits,
  unknown
>;

export default InputRangeNumber;
