import { TextareaHTMLAttributes } from 'vue';
import {
  ClassComponent,
  GlobalComponentConstructor,
  Nullable,
} from '../ts-helpers.d';
import { InputTextProps } from '../inputtext/InputText.vue.d';

export type Condition = 'empty' | 'exceed';

export type CustomValidation = Partial<Record<Condition, string>>;

/**
 * Defines valid properties in Textarea component. In addition to these, all properties of TextareaHTMLAttributes can be used in this component.
 * @extends TextareaHTMLAttributes
 * @extends InputTextProps
 */
export interface TextareaProps
  extends /* @vue-ignore */ TextareaHTMLAttributes,
    InputTextProps {
  /**
   * The model value of text area.
   */
  modelValue?: Nullable<string>;
  /**
   * Sets the initial value of the field. This will only available with option 'useValidator'.
   *
   * In use case like edit form, you need to display the previous inputted value.
   */
  value?: Nullable<string>;
  invalid?: boolean;
  /**
   * Disabled input state.
   */
  disabled?: boolean;
  /**
   * When present, height of textarea changes as being typed.
   * @defaultValue true
   */
  autoResize?: boolean | undefined;
  /**
   * Specifies the input variant of the component.
   * @defaultValue outlined
   */
  variant?: 'outlined' | 'filled' | undefined;
  /**
   * Whether the input should be validated with vee-validator or not.
   * If you use this component within form input, you need to set this props as true.
   */
  useValidator?: boolean;
  /**
   * This prop is required if you use this component in a form input.
   * Specify the unique field name, match with your needs for API request.
   *
   * @default 'textareaInput'
   */
  fieldName?: string;
  mandatory?: boolean;
  /**
   * The maximum character length allowed by validator.
   *
   * @default unlimited
   */
  maxInput?: number;
  /**
   * The maximum character length allowed on input.
   *
   * @default unlimited
   */
  maxlength?: number;
  /**
   * @deprecated - now validatorMessage support type CustomValidation
   *
   * @see {InputTextProps.validatorMessage}
   */
  customValidation?: CustomValidation;
  inputClass?: string;
  rows?: number;
  /**
   * Specify the input placeholder.
   *
   * @default 'Enter {label}' or 'Enter {type}'
   */
  placeholder?: string;
  /**
   * The input label. Tell the user what input is this.
   */
  label?: string;
}

/**
 * Defines valid emits in Textarea component.
 */
export type TextareaEmits = {
  /**
   * Emitted when the value changes.
   */
  'update:modelValue': [value: Nullable<string>];
};

/**
 * **TSVue - Textarea**
 *
 * _Textarea is a multi-line text input element._
 *
 * --- ---
 * ![TSVue](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group Component
 *
 */
declare class Textarea extends ClassComponent<
  TextareaProps,
  Record<string, unknown>,
  TextareaEmits
> {}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    Textarea: GlobalComponentConstructor<Textarea>;
  }
}

export default Textarea;
