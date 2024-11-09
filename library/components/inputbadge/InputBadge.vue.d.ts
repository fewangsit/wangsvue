import { CustomValidation } from '../form/Form.vue.d';
import { ClassComponent, GlobalComponentConstructor } from '../ts-helpers';

/**
 * InputBadge component props
 */
export interface InputBadgeProps {
  /**
   * The type of input, whether input text or input email
   *
   * @default text
   */
  type?: 'text' | 'email';
  /**
   * The model value. Used for input without validation.
   */
  modelValue?: string[];
  /**
   * Sets the initial value of the field.
   * This will only available with option 'useValidator'.
   *
   * In use case like edit form, you need to display the previous inputted value.
   */
  initialValue?: string[];
  /**
   * Determines if the field uses a validator
   */
  useValidator?: boolean;
  /**
   * Exisitng values to be checkeed with validation 'exist' - check the validatorMessage props
   *
   * - Need to specify the custom validation : { empty: 'Error message when empty' } within props validatorMessage
   */
  existingValues?: string[];
  /**
   * Determines if the field is mandatory
   */
  mandatory?: boolean;
  /**
   * Set custom validator message.
   */
  validatorMessage?: string | CustomValidation;
  /**
   * Whether shows the invalid message or not.
   * The validator message will be shown if useValidator true and the field label is specified.
   *
   * Sets this props to 'false' to force the validator message always hidden.
   *
   * @default true
   */
  showValidatorMessage?: boolean;
  /**
   * Set the invalid state.
   *
   * @default - If field is mandatory, the field will be considered invalid if the input is empty.
   */
  invalid?: boolean;
  /**
   * This prop is required if you use this component in a form input.
   * Specify the unique field name, match with your needs for API request.
   *
   * @default 'inputBadge'
   */
  fieldName?: string;
  /**
   * The text input placholder.
   *
   * @default 'Enter value'
   */
  placeholder?: string;
  /**
   * Disabled state.
   */
  disabled?: boolean;
  /**
   * The field input label. Tell the user what input is this.
   */
  label?: string;
  /**
   * Show information to user about the field.
   */
  fieldInfo?: string;
}

/**
 * InputBadge component emits
 */
export type InputBadgeEmits = {
  /**
   * Emits when a new label added.
   */
  'update:modelValue': [value: string[] | undefined];
};

/**
 * **WangsVue - InputBadge**
 *
 * _InputBadge is input text that changes it value into Badge component on Enter key pressed._
 *
 * --- ---
 * ![WangsVue](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group Component
 */
declare class InputBadge extends ClassComponent<
  InputBadgeProps,
  Record<string, unknown>,
  InputBadgeEmits
> {}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    InputBadge: GlobalComponentConstructor<InputBadge>;
  }
}

export default InputBadge;
