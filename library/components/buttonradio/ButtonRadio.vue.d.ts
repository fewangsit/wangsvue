import { ComponentHooks } from '../basecomponent';
import { PassThroughOptions } from '../passthrough';
import {
  ClassComponent,
  GlobalComponentConstructor,
  PassThrough,
} from '../ts-helpers';

export declare type ButtonRadioPassThroughOptionType =
  | ButtonRadioPassThroughAttributes
  | ((
      options: ButtonRadioPassThroughMethodOptions,
    ) => ButtonRadioPassThroughAttributes | string)
  | string
  | null
  | undefined;

/**
 * Custom passthrough(pt) option method.
 */
export interface ButtonRadioPassThroughMethodOptions {
  /**
   * Defines instance.
   */
  instance: any;
  /**
   * Defines valid properties.
   */
  props: ButtonRadioProps;
  /**
   * Defines current inline state.
   */
  state: ButtonRadioState;
  /**
   * Defines current options.
   */
  context: ButtonRadioContext;
  /**
   * Defines valid attributes.
   */
  attrs: any;
  /**
   * Defines parent options.
   */
  parent: any;
  /**
   * Defines passthrough(pt) options in global config.
   */
  global: object | undefined;
}

/**
 * Custom passthrough(pt) options.
 * @see {@link ButtonRadioProps.pt}
 */
export interface ButtonRadioPassThroughOptions {
  /**
   * Used to pass attributes to the root's DOM element.
   */
  root?: ButtonRadioPassThroughOptionType;
  /**
   * Used to pass attributes to the input's DOM element.
   */
  input?: ButtonRadioPassThroughOptionType;
  /**
   * Used to pass attributes to the box's DOM element.
   */
  box?: ButtonRadioPassThroughOptionType;
  /**
   * Used to pass attributes to the icon's DOM element.
   */
  icon?: ButtonRadioPassThroughOptionType;
  /**
   * Used to manage all lifecycle hooks.
   * @see {@link BaseComponent.ComponentHooks}
   */
  hooks?: ComponentHooks;
}

/**
 * Custom passthrough attributes for each DOM elements
 */
export interface ButtonRadioPassThroughAttributes {
  [key: string]: any;
}

/**
 * Defines current inline state in ButtonRadio component.
 */
export interface ButtonRadioState {
  [key: string]: any;
}

/**
 * Defines valid properties in ButtonRadio component.
 */
export interface ButtonRadioProps {
  /**
   * The label for the input element
   */
  label?: string;
  /**
   * Value of the checkbox.
   */
  value?: any;
  /**
   * Value binding of the checkbox.
   */
  modelValue?: any;
  /**
   * Name of the input element.
   */
  name?: string | undefined;
  /**
   * Allows to select a boolean value.
   * @default false
   */
  binary?: boolean;
  /**
   * When present, it specifies that the component should have invalid state style.
   * @defaultValue false
   */
  invalid?: boolean | undefined;
  /**
   * When present, it specifies that the component should be disabled.
   * @defaultValue false
   */
  disabled?: boolean | undefined;
  /**
   * Specifies the input variant of the component.
   * @defaultValue outlined
   */
  variant?: 'outlined' | 'filled' | undefined;
  /**
   * When present, it specifies that an input field is read-only.
   * @default false
   */
  readonly?: boolean | undefined;
  /**
   * Index of the element in tabbing order.
   */
  tabindex?: number | undefined;
  /**
   * Identifier of the underlying input element.
   */
  inputId?: string | undefined;
  /**
   * Inline style of the input field.
   */
  inputStyle?: object | undefined;
  /**
   * Style class of the input field.
   */
  inputClass?: string | object | undefined;
  /**
   * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
   */
  ariaLabelledby?: string | undefined;
  /**
   * Establishes a string value that labels the component.
   */
  ariaLabel?: string | undefined;
  /**
   * Used to pass attributes to DOM elements inside the component.
   * @type {ButtonRadioPassThroughOptions}
   */
  pt?: PassThrough<ButtonRadioPassThroughOptions>;
  /**
   * Used to configure passthrough(pt) options of the component.
   * @type {PassThroughOptions}
   */
  ptOptions?: PassThroughOptions;
  /**
   * When enabled, it removes component related styles in the core.
   * @defaultValue false
   */
  unstyled?: boolean;
}

/**
 * Defines current options in ButtonRadio component.
 */
export interface ButtonRadioContext {
  /**
   * Current checked state of the item as a boolean.
   * @defaultValue false
   */
  checked: boolean;
  /**
   * Current disabled state of the item as a boolean.
   * @defaultValue false
   */
  disabled: boolean;
}

/**
 * Defines valid emits in ButtonRadio component.
 */
export type ButtonRadioEmits = {
  /**
   * Emitted when the value changes.
   * @param {*} value - New value.
   */
  'update:modelValue'(value: any): void;
  /**
   * Callback to invoke on radio button value change.
   * @param {Event} event - Browser event.
   */
  change(event: Event): void;
  /**
   * Callback to invoke when the component receives focus.
   * @param {Event} event - Browser event.
   */
  focus(event: Event): void;
  /**
   * Callback to invoke when the component loses focus.
   * @param {Event} event - Browser event.
   */
  blur(event: Event): void;
};

/**
 * **WangsVue - ButtonRadio**
 *
 * _ButtonRadio is an extension to standard radio button element with theming._
 *
 * [Live Demo](https://fewangsit.github.io/wangsvue/buttonradio)
 * --- ---
 * ![WangsVue](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group Component
 *
 */
declare class ButtonRadio extends ClassComponent<
  ButtonRadioProps,
  unknown,
  ButtonRadioEmits
> {}

declare module 'vue' {
  export interface GlobalComponents {
    ButtonRadio: GlobalComponentConstructor<ButtonRadio>;
  }
}

export default ButtonRadio;
