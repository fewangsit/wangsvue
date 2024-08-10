import { DefineComponent } from 'vue';
import { ButtonProps } from 'primevue/button';
import type { TSVueIcons } from 'lib/components/Icon/Icon.vue.d';

export interface TSButtonProps
  extends /* @vue-ignore */ Omit<ButtonProps, 'icon'> {
  /**
   * Tooltip/information to show on button hover.
   */
  tooltip?: string;
  /**
   * Set the position of tooltip.
   * @default bottom
   */
  tooltipPos?: 'top' | 'right' | 'bottom' | 'left';
  icon?: TSVueIcons;
  /**
   * @default left
   */
  iconPos?: 'left' | 'right';
  /**
   * Style class of the icon.
   */
  iconClass?: string | string[];
}

declare const TSButton: DefineComponent<TSButtonProps>;

export default TSButton;
