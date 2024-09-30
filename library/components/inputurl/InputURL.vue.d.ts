import { Slot } from 'vue';
import { ClassComponent, Nullable } from '../ts-helpers';
import { CustomValidation } from '../form/Form.vue.d';

/**
 * InputURL component props
 */
export interface InputURLProps {
  /**
   * Model value for the input field
   */
  modelValue?: string;

  /**
   * Label for the input field
   */
  label?: string;

  /**
   * Field name for the input field
   */
  fieldName?: string;

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
   * Custom invalid state.
   */
  invalid?: boolean;

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
   * Whether validate the protocol http/https
   *
   * @default true
   */
  useProtocol?: boolean;
}

/**
 * InputURL component emits
 */
export type InputURLEmits = {
  /**
   * Event emitted when the model value is updated
   */
  'update:modelValue': [payload?: Nullable<string>];
};

export type InputURLSlots = {
  'addon-left': Slot;
  'addon-right': Slot;
};

/**
 * **WangsVue - InputURL**
 *
 * _Handle input email with form validation._
 *
 * --- ---
 * ![WangsVue](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group form
 */
declare class InputURL extends ClassComponent<
  InputURLProps,
  InputURLSlots,
  InputURLEmits
> {}

export default InputURL;
