import { VNode } from 'vue';
import { ClassComponent, GlobalComponentConstructor } from '../ts-helpers';
import { BadgeProps } from 'lib/components/badge/Badge.vue';

/**
 * Defines valid properties in ProgressBar component.
 */
export interface ProgressBarProps {
  /**
   * Current value of the progress.
   */
  value?: number | undefined;
  /**
   * The progress bar severity color
   *
   * All Badge severity is supported, except 'dark'
   *
   * @defaultValue 'primary'
   */
  severity: Omit<BadgeProps['severity'], 'dark'>;
  /**
   * Defines the mode of the progress
   * @defaultValue determinate
   */
  mode?: 'determinate' | 'indeterminate' | undefined;
  /**
   * Whether to display the progress bar value.
   * @defaultValue true
   */
  showValue?: boolean | undefined;
}

/**
 * Defines valid slots in ProgressBar component.
 */
export interface ProgressBarSlots {
  /**
   * Custom content slot.
   */
  default(): VNode[];
}

/**
 * **WangsVue - ProgressBar**
 *
 * ProgressBar is a process status indicator._
 *
 * Live Demo https://fewangsit.github.io/wangsvue/projectsummary
 *
 * --- ---
 * ![WangsVue](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group Component
 */
declare class ProgressBar extends ClassComponent<
  ProgressBarProps,
  ProgressBarSlots,
  null
> {}

declare module 'vue' {
  export interface GlobalComponents {
    ProgressBar: GlobalComponentConstructor<ProgressBar>;
  }
}

export default ProgressBar;
