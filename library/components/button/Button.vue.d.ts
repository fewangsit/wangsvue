import { ButtonHTMLAttributes, VNode } from 'vue';
import { WangsIcons } from '../icon/Icon.vue.d';
import { TooltipOptions } from 'primevue/tooltip';
import { GlobalComponentConstructor } from '../ts-helpers.d';
import { ClassComponent, HintedString } from '../ts-helpers';

/**
 * Defines valid properties in Button component.
 */
export interface ButtonProps extends /* @vue-ignore */ ButtonHTMLAttributes {
  /**
   * Inline style of the button.
   */
  style?: any;
  /**
   * Style class of the button.
   */
  class?: any;
  /**
   * Text of the button.
   */
  label?: string | undefined;
  /**
   * Name of the icon.
   */
  icon?: WangsIcons | undefined;
  /**
   * Position of the icon.
   * @defaultValue left
   */
  iconPos?: 'left' | 'right' | 'top' | 'bottom' | undefined;
  /**
   * Style class of the icon.
   */
  iconClass?: string | undefined;
  /**
   * Tooltip/information to show on button hover.
   */
  tooltip?: string | TooltipOptions;
  /**
   * Set the position of tooltip.
   * @default bottom
   */
  tooltipPos?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * Value of the badge.
   */
  badge?: string | undefined;
  /**
   * Style class of the badge.
   */
  badgeClass?: string | undefined;
  /**
   * Severity type of the badge.
   */
  badgeSeverity?:
    | HintedString<
        'secondary' | 'info' | 'success' | 'warning' | 'danger' | 'contrast'
      >
    | null
    | undefined;
  /**
   * Whether the button is in loading state.
   * @defaultValue false
   */
  loading?: boolean | undefined;
  /**
   * Icon to display in loading state.
   */
  loadingIcon?: string | undefined;
  /**
   *  Add a link style to the button.
   * @defaultValue false
   */
  link?: boolean | undefined;
  /**
   * Defines the style of the button.
   */
  severity?:
    | HintedString<
        | 'secondary'
        | 'success'
        | 'info'
        | 'warning'
        | 'help'
        | 'danger'
        | 'contrast'
      >
    | undefined;
  /**
   * Add a shadow to indicate elevation.
   * @defaultValue false
   */
  raised?: boolean | undefined;
  /**
   * Add a circular border radius to the button.
   * @defaultValue false
   */
  rounded?: boolean | undefined;
  /**
   * Add a textual class to the button without a background initially.
   * @defaultValue false
   */
  text?: boolean | undefined;
  /**
   * Add a border class without a background initially.
   * @defaultValue false
   */
  outlined?: boolean | undefined;
  /**
   * Defines the size of the button.
   */
  size?: 'small' | 'large' | undefined;
  /**
   * Add a plain textual class to the button without a background initially.
   * @defaultValue false
   */
  plain?: boolean | undefined;
}

/**
 * Defines current options in Button component.
 */
export interface ButtonContext {
  /**
   * Current disabled state of the element as a boolean.
   * @defaultValue false
   */
  disabled: boolean;
}

/**
 * Defines valid slots in Button component.
 */
export interface ButtonSlots {
  /**
   * Custom content such as icons, images and text can be placed inside the button via the default slot. Note that when slot is used, label, icon and badge properties are not included.
   */
  default(): VNode[];
  /**
   * Custom icon template.
   * @param {Object} scope - icon slot's params.
   */
  icon(scope: {
    /**
     * Style class of the icon.
     */
    class: string;
  }): VNode[];
  /**
   * Custom loading icon template.
   * @param {Object} scope - loading icon slot's params.
   */
  loadingicon(scope: {
    /**
     * Style class of the loading icon.
     */
    class: string;
  }): VNode[];
}

/**
 * **WangsVue - Button**
 *
 * _Button is an extension to standard button element with icons and theming._
 *
 * [Live Demo](https://fewangsit.github.io/wangsvue/table)
 * --- ---
 * ![WangsVue](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group Component
 */
declare class Button extends ClassComponent<
  ButtonProps,
  ButtonSlots,
  Record<string, unknown>
> {}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    Button: GlobalComponentConstructor<Button>;
  }
}

export default Button;
