import { Slot } from 'vue';
import { ClassComponent } from '../ts-helpers';
import { GlobalComponentConstructor } from 'lib/components/ts-helpers';

/**
 * Defines valid properties in ProgressBar component.
 */
export interface ProgressBarProps {
  /**
   * Current value of the progress.
   */
  value?: number | undefined;
  /**
   * Set the position of progress value label position
   * Only available on mode Determinate
   *
   * @default 'right-side'
   */
  valuePosition?: 'inside' | 'left-side' | 'right-side';
  /**
   * The progress bar severity color
   *
   * @defaultValue 'primary'
   */
  severity: 'success' | 'danger' | 'warning' | 'dark' | 'primary';
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
   * Slot for customizing the value label.
   */
  label: Slot<{ value: number | undefined }>;
}

/**
 * **WangsVue - ProgressBar**
 *
 * ProgressBar is a process status indicator._
 *
 * [Live Demo](https://fewangsit.github.io/wangsvue/progressbar)
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

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    ProgressBar: GlobalComponentConstructor<ProgressBar>;
  }
}

export default ProgressBar;
