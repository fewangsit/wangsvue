import { ClassComponent, GlobalComponentConstructor } from '../ts-helpers';

import { MultiSelectOption, OptionValue } from 'lib/types/options.type';

/**
 * MultiSelect component props
 */
export interface MultiSelectProps {
  modelValue?: OptionValue[];
  /**
   * If you deals with form validation on edit form action, you can set the initial value of the field.
   */
  initialValue?: OptionValue[];
  /**
   * The field label. Tell the user what field input is this.
   */
  label?: string;
  /**
   * List of options to display.
   */
  options?: MultiSelectOption[] | string[];
  /**
   * Specify the property name of option to be used as label.
   *
   * @default undefined - the label will be sets to the option itself.
   */
  optionLabel?: string;
  /**
   * Specify the property name of option to be used as value.
   *
   * @default undefined - the value will be sets to the option itself.
   */
  optionValue?: string;
  /**
   * Determines if the field uses a validator
   */
  useValidator?: boolean;
  /**
   * Determines if the field is mandatory
   */
  mandatory?: boolean;
  /**
   * Show the text (opsional)
   *
   * @default true if mandatory true
   */
  showOptionalText?: boolean;
  /**
   * Set custom validator message.
   * It is rarely use, this component has handled the validator message.
   */
  validatorMessage?: string;
  /**
   * This prop is required if you use this component in a form input.
   * Specify the unique field name, match with your needs for API request.
   *
   * @default 'multiSelect'
   */
  fieldName?: string;
  /**
   * Default text to display when no option is selected.
   *
   * @default `Select ${label}`
   */
  placeholder?: string;
  /**
   * Whether the MultiSelect is in loading state.
   * @defaultValue false
   */
  loading?: boolean;
  /**
   * Show icon 'info' on the right side of label.
   * Show information to user about the field on icon hover.
   */
  fieldInfo?: string;
  /**
   * Hide the input and controls the overlay state from parent component.
   */
  controls?: boolean;
  /**
   * Disabled state.
   */
  disabled?: boolean;
  /**
   * Wether show the Dropdown option search or not.
   *
   * @default true,
   */
  filter?: boolean;
  /**
   * The filter input Placeholder
   *
   * @default 'Search'
   */
  filterPlaceholder?: string;
  /**
   * Defines how the selected items are displayed.
   *
   * @default 'chip'
   */
  display?: 'comma' | 'chip';
  /**
   * Defines the placeholder (label in input) as medium font.
   * Used in preset.
   *
   * @default false
   */
  fontMediumPlaceholder?: boolean;
  /**
   * Label to display after exceeding max selected labels.
   */
  selectedItemsLabel?: string;
  /**
   * Decides how many selected item labels to show at most.
   */
  maxSelectedLabels?: number;
}

/**
 * MultiSelect component emits
 */
export type MultiSelectEmits = {
  /**
   * Emits when an option selected.
   */
  'update:modelValue': [value: OptionValue[] | undefined];
  /**
   * Emits when overlay shown.
   */
  'show': [];
  /**
   * Emits when overlay hidden.
   */
  'hide': [];
};

/**
 * **WangsVue - MultiSelect**
 *
 * _MultiSelect also known as Select, is used to choose an item from a collection of options._
 *
 * @group Component
 */
declare class MultiSelect extends ClassComponent<
  MultiSelectProps,
  unknown,
  MultiSelectEmits
> {
  /**
   * Shows the overlay.
   *
   * @memberof MultiSelect
   */
  showOverlay(): void;
  /**
   * Hides the overlay.
   *
   * @memberof MultiSelect
   */
  hideHideOverlay(): void;
}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    MultiSelect: GlobalComponentConstructor<MultiSelect>;
  }
}

export default MultiSelect;
