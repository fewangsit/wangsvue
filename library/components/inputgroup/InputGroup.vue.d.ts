/**
 *
 * InputGroup displays text, icon, buttons and other content can be grouped next to an input.
 *
 * @module inputgroup
 *
 */
import { VNode } from 'vue';
import { ComponentHooks } from '../basecomponent';
import { PassThroughOptions } from '../passthrough';
import {
  ClassComponent,
  GlobalComponentConstructor,
  PassThrough,
} from '../ts-helpers';

export declare type InputGroupPassThroughOptionType =
  | InputGroupPassThroughAttributes
  | ((
      options: InputGroupPassThroughMethodOptions,
    ) => InputGroupPassThroughAttributes | string)
  | string
  | null
  | undefined;

/**
 * Custom passthrough(pt) option method.
 */
export interface InputGroupPassThroughMethodOptions {
  /**
   * Defines instance.
   */
  instance: any;
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
 * @see {@link InputGroupProps.pt}
 */
export interface InputGroupPassThroughOptions {
  /**
   * Used to pass attributes to the root's DOM element.
   */
  root?: InputGroupPassThroughOptionType;
  /**
   * Used to manage all lifecycle hooks.
   * @see {@link BaseComponent.ComponentHooks}
   */
  hooks?: ComponentHooks;
}

/**
 * Custom passthrough attributes for each DOM elements
 */
export interface InputGroupPassThroughAttributes {
  [key: string]: any;
}

/**
 * Defines valid properties in InputGroup component.
 */
export interface InputGroupProps {
  /**
   * Used to pass attributes to DOM elements inside the component.
   * @type {InputGroupPassThroughOptions}
   */
  pt?: PassThrough<InputGroupPassThroughOptions>;
  /**
   * Used to configure passthrough(pt) options of the component.
   * @type {PassThroughOptions}
   */
  ptOptions?: PassThroughOptions;
  /**
   * @default default
   */
  ring?: 'none' | 'default';
  /**
   * When enabled, it removes component related styles in the core.
   * @defaultValue false
   */
  unstyled?: boolean;
  /**
   * @defaultValue false
   */
  invalid?: boolean;
  /**
   * @defaultValue false
   */
  disabled?: boolean;
}

/**
 * Defines valid slots in InputGroup component.
 */
export interface InputGroupSlots {
  /**
   * Custom default template.
   */
  default(): VNode[];
  /**
   * Dynamic content template.
   * @todo
   */
  [key: string]: (node: any) => VNode[];
}

/**
 * **WangsVue - InputGroup**
 *
 * _InputGroup displays text, icon, buttons and other content can be grouped next to an input._
 *
 * --- ---
 * ![WangsVue](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group Component
 */
declare class InputGroup extends ClassComponent<
  InputGroupProps,
  InputGroupSlots,
  unknown
> {}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    InputGroup: GlobalComponentConstructor<InputGroup>;
  }
}

export default InputGroup;
