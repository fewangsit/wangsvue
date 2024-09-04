import { ClassComponent, Nullable } from '../ts-helpers';
import { CustomValidation } from '../form/Form.vue.d';

/**
 * InputRepositoryName component props
 */
export interface InputRepositoryNameProps {
  /**
   * Model value for the input field
   * @required
   */
  modelValue: string;

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
}

/**
 * InputRepositoryName component emits
 */
export type InputRepositoryNameEmits = {
  /**
   * Event emitted when the model value is updated
   */
  'update:modelValue': [payload?: Nullable<string>];
};

/**
 * **WangsVue - InputRepositoryName**
 *
 * _Handle input repository name with form validation._
 *
 * --- ---
 * ![WangsVue](https://ik.imagekit.io/kurniadev/TS-HEAD-BLACK.png)
 *
 * @group form
 */
declare class InputRepositoryName extends ClassComponent<
  InputRepositoryNameProps,
  unknown,
  InputRepositoryNameEmits
> {}

export default InputRepositoryName;
