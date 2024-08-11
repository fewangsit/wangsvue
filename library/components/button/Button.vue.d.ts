import { DefineComponent } from 'vue';
import { ButtonProps as PrimeButtonProps } from 'primevue/button';
import type { WangsIcons } from 'lib/components/icon/Icon.vue.d';

export interface ButtonProps
  extends /* @vue-ignore */ Omit<PrimeButtonProps, 'icon' | 'iconClass'> {
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
}

declare const TSButton: DefineComponent<ButtonProps>;

export default TSButton;
