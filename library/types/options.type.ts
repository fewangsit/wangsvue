import { WangsIcons } from 'lib/components/icon/Icon.vue.d';

export type OptionValue = string | number | boolean | Record<string, unknown>;

export type DropdownOption = {
  label: string;
  value?: OptionValue;
  visible?: boolean;
  icon?: WangsIcons;
};

export type MultiSelectOption = {
  label: string;
  value?: OptionValue;
  visible?: boolean;
  icon?: WangsIcons;
};
