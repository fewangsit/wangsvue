import { ClassComponent } from '../ts-helpers';

/**
 * Props for Badge component
 */
export interface BadgeProps {
  /**
   * The text to be displayed.
   */
  label: string;
  /**
   * Whether the badge text is editable.
   */
  editable?: boolean;
  /**
   * Sets the severity level for styling purposes.
   */
  severity?: 'success' | 'danger' | 'warning' | 'dark' | 'primary';
  /**
   * Specifies the format for text truncation rules based on the usage context.
   */
  format?: 'username' | 'nowrap';
  /**
   * Whether to show the remove icon or not. Clicking the remove icon will emit 'remove' event.
   */
  removable?: boolean;
  /**
   * Whether to set badge become disabled.
   */
  disabled?: boolean;
}

/**
 * Emits for Badge component
 */
export type BadgeEmits = {
  'remove': [];
  /**
   * Emits when the text is edited.
   * Only available when props.editable=true
   */
  'update:label': [label: string | null];
};

/**
 * **WangsVue - Badge**
 *
 * _Badge is a component for displaying a text with optional remove functionality._
 *
 * @group components
 */
export default class Badge extends ClassComponent<
  BadgeProps,
  unknown,
  BadgeEmits
> {}
