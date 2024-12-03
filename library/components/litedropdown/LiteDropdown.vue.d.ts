import { DropdownOption, OptionValue } from 'lib/types/options.type';
import { ClassComponent, GlobalComponentConstructor } from '../ts-helpers';
import { DropdownChangeEvent } from 'primevue/dropdown';

/**
 * Lite dropdown component props
 */
export interface LiteDropdownProps {
  modelValue: OptionValue;
  options: DropdownOption[] | undefined;
  /**
   * Specify the property name of option to be used as label.
   *
   * @default undefined - the label will be sets to the option itself.
   */
  optionLabel: string;
  /**
   * Specify the property name of option to be used as value.
   *
   * @default undefined - the value will be sets to the option itself.
   */
  optionValue: string;
  /**
   * Determines if the field is mandatory
   */
  mandatory?: boolean;
  /**
   * Default text to display when no option is selected.
   *
   * @default `Pilih data`
   */
  placeholder?: string;
  /**
   * Whether the dropdown is in loading state.
   * @defaultValue false
   */
  loading?: boolean;
  /**
   * Set disabled state for input dropdown.
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
   * @default 'Cari'
   */
  filterPlaceholder?: string;
}

/**
 * Lite dropdown component emits
 */
export type LiteDropdownEmits = {
  /**
   * Emits when an option selected.
   */
  'update:modelValue': [value: OptionValue | undefined];
  /**
   * Emits when overlay shown.
   */
  'show': [];
  /**
   * Emits when there is a change on the dropdown value.
   */
  'change': [value: DropdownChangeEvent];
};

/**
 * **WangsVue - LiteDropwdown**
 *
 * _LiteDropdown, a lite version of the Dropdown component._
 *
 * --- ---
 * ![WangsVue](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group Component
 */
declare class LiteDropdown extends ClassComponent<
  LiteDropdownProps,
  unknown,
  LiteDropdownEmits
> {}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    Dropdown: GlobalComponentConstructor<LiteDropdown>;
  }
}

export default LiteDropdown;
