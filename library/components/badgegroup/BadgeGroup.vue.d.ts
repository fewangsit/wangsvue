import { BadgeProps } from 'lib/components/badge/Badge.vue.d';
import { ClassComponent } from '../ts-helpers.d';

export interface BadgeGroupProps
  extends Omit<BadgeProps, 'label' | 'disabled' | 'removable'> {
  labels: string[];
  /**
   * The text shown on the more button
   *
   * @default 'more'
   */
  textMore?: string;
  /**
   * Maximum number of label to be shown.
   */
  limit?: number;
  /**
   * The dialog header shown on more button clicked
   */
  headerLabel?: string;
  /**
   * Specify if the badge should be emptyable
   * @default false
   */
  emptyable?: boolean;
}

export default class Badge extends ClassComponent<
  BadgeGroupProps,
  unknown,
  unknown
> {}
