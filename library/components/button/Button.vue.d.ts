import { ButtonHTMLAttributes, DefineComponent } from 'vue';
import type { WangsIcons } from 'lib/components/icon/Icon.vue.d';

export interface ButtonProps extends ButtonHTMLAttributes {
  /**
   * Text of the button.
   */
  label?: string | undefined;
  /**
   * Defines the style of the button.
   */
  severity?: 'secondary' | 'success' | 'warning' | 'danger';
  /**
   * Tooltip/information to show on button hover.
   */
  tooltip?: string;
  /**
   * Set the position of tooltip.
   * @default bottom
   */
  tooltipPos?: 'top' | 'right' | 'bottom' | 'left';
  icon?: WangsIcons;
  /**
   * @default left
   */
  iconPos?: 'left' | 'right';
  /**
   * Style class of the icon.
   */
  iconClass?: string | string[];
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
}

declare const TSButton: DefineComponent<ButtonProps>;

export default TSButton;
