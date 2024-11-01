import { BadgeProps } from 'lib/components/badge/Badge.vue.d';
import { ClassComponent } from 'lib/components/ts-helpers';

export interface BadgeGroupProps
  extends Omit<BadgeProps, 'label' | 'disabled' | 'removable'> {
  labels: string[];
  /**
   * Maximum number of label to be shown.
   */
  limit?: number;
  /**
   * The dialog header shown on more button clicked
   */
  headerLabel?: string;
  /**
   * TODO: Implement emptyable badge group
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
