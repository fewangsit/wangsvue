import { DefineComponent } from 'vue';

export interface ButtonToggleProps {
  modelValue?: boolean;
  /**
   * Whether this button toggle is a tristate toggle.
   * @defaultValue false
   */
  triState?: boolean;
}

export type ButtonToggleEmits = {
  'update:modelValue': [state: boolean];
};

declare const ButtonToggle: DefineComponent<
  ButtonToggleProps,
  ButtonToggleEmits
>;

export default ButtonToggle;
