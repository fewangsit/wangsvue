import { DefineComponent } from 'vue';
import type { BadgeProps } from 'lib/components/badge/Badge.vue.d';

export interface BadgeGroupProps
  extends Omit<BadgeProps, 'label' | 'disabled' | 'removable'> {
  labels: string[];
  limit?: number;
  headerLabel?: string;
}

declare const BadgeGroup: DefineComponent<BadgeGroupProps>;

export default BadgeGroup;
