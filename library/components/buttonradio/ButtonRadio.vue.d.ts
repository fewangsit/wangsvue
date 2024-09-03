/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefineComponent } from 'vue';

export type ButtonRadioProps = {
  modelValue: any;
  name: string;
  value: any;
  binary?: boolean;
  disabled?: boolean;
  label?: string;
};

export type ButtonRadioEmits = {
  'update:modelValue': [state: any];
};

declare const ButtonRadio: DefineComponent<ButtonRadioProps, ButtonRadioEmits>;

export default ButtonRadio;
