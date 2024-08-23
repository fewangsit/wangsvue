/**
 *
 * InputText renders a text field to enter data.
 *
 * [Live Demo](https://www.WangsVue.org/inputtext/)
 *
 * @module inputtext
 *
 */
import { InputHTMLAttributes } from 'vue';
import { ComponentHooks } from '../basecomponent';
import { ClassComponent, Nullable } from '../ts-helpers';
import { CustomValidation } from '../form/Form.vue.d';
export declare type InputTextPassThroughOptionType<T = any> =
  | InputTextPassThroughAttributes
  | ((
      options: InputTextPassThroughMethodOptions<T>,
    ) => InputTextPassThroughAttributes | string)
  | string
  | null
  | undefined;

/**
 * Custom passthrough(pt) option method.
 */
export interface InputTextPassThroughMethodOptions<T = any> {
  /**
   * Defines instance.
   */
  instance: any;
  /**
   * Defines valid properties.
   */
  props: InputTextProps;
  /**
   * Defines current options.
   */
  context: InputTextContext;
  /**
   * Defines parent instance.
   */
  parent: T;
  /**
   * Defines passthrough(pt) options in global config.
   */
  global: object | undefined;
}

/**
 * Custom passthrough(pt) options.
 * @see {@link InputTextProps.pt}
 */
export interface InputTextPassThroughOptions<T = any> {
  /**
   * Used to pass attributes to the root's DOM element.
   */
  root?: InputTextPassThroughOptionType<T>;
  /**
   * Used to manage all lifecycle hooks.
   * @see {@link BaseComponent.ComponentHooks}
   */
  hooks?: ComponentHooks;
}

/**
 * Custom passthrough attributes for each DOM elements
 */
export interface InputTextPassThroughAttributes {
  [key: string]: any;
}

/**
 * Defines current options in InputText component.
 */
export interface InputTextContext {
  /**
   * Current filled state of the component as a boolean.
   * @defaultValue false
   */
  filled: boolean;
  /**
   * Current disabled state of the component as a boolean.
   * @defaultValue false
   */
  disabled: boolean;
}

/**
 * Defines valid properties in InputText component.
 */
export interface InputTextProps extends /* @vue-ignore */ InputHTMLAttributes {
  /**
   * String modelValue of the input.
   */
  modelValue?: Nullable<string>;
  /**
   * Sets the initial value of the field.
   * This will only available with option 'useValidator'.
   *
   * In usecase like edit form, you need to display the previous inputted value.
   */
  value?: string;
  /**
   * Exisitng values to be checkeed with validation 'exist' - check the validatorMessage props
   *
   * - Need to specify the custom validation : { empty: 'Error message when empty' } within props validatorMessage
   */
  existingValues?: string[];
  /**
   * The maximun character length allowed.
   *
   * @default 30 - for inputText;
   * @default unlimited - for textarea;
   */
  maxLength?: number;
  /**
   * The input label. Tell the user what input is this.
   */
  label?: string;
  /**
   * Wether the input should be validated with vee-validator or not.
   * If you use this component within form input, you need to set this props as true.
   */
  useValidator?: boolean;
  /**
   * This prop is required if you use this component in a form input.
   * Specify the unique field name, match with your needs for API request.
   *
   * @default 'textInput'
   */
  fieldName?: string;
  /**
   * Wether this input field is required or not.
   */
  mandatory?: boolean;
  /**
   * Invalid input state.
   */
  invalid?: boolean;
  /**
   * Set manual invalid input container state.
   */
  manualInvalidContainer?: boolean;
  /**
   * Set custom validator message.
   * Will be show if invalid="true"
   */
  validatorMessage?: string | CustomValidation;
  /**
   * Classes for validator message in input field.
   */
  validatorMessageClass?: string;
  /**
   * Specify the input placeholder.
   *
   * @default 'Enter {label}' or 'Enter {type}'
   */
  placeholder?: string;
  /**
   * Specify the validation type. Wether 'email' or 'text' validation.
   */
  type?: 'email' | 'text' | 'url' | 'initialname';
  /**
   * Disabled the input.
   */
  disabled?: boolean;
  /**
   * Show information to user about the field.
   */
  fieldInfo?: string;
  /**
   * Specify classes for input.
   */
  inputClass?: string;
  /**
   * Specify classes for input container.
   */
  inputContainerClass?: string;
  /**
   * Specify classes for label.
   */
  labelClass?: string;
  /**
   * Auto blur while input value has reached the max length.
   */
  blurOnReachMaxLength?: boolean;
}

/**
 * Defines valid emits in InputText component.
 */
export type InputTextEmits = {
  /**
   * Emitted when the value changes.
   * @param {string} value - New value.
   */
  'update:modelValue': [value: string | undefined];
  'blur': [payload?: Nullable<string>];
  'input': [payload?: Nullable<string>];
};

/**
 * **WangsVue - InputText**
 *
 * _InputText renders a text field to enter data._
 *
 * --- ---
 *
 * @group Component
 */
declare class InputText extends ClassComponent<
  InputTextProps,
  unknown,
  InputTextEmits
> {}

export default InputText;
