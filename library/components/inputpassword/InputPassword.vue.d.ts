import { DefineComponent } from 'vue';

export type InputPasswordProps = {
  modelValue?: string;
  label?: string;
  labelClass?: string;
  inputContainerClass?: string;
  mandatory?: boolean;
  placeholder?: string;
  feedback?: boolean;
  fieldName?: string;
  useValidator?: boolean;
  invalid?: boolean;
  validatorMessage?: string;
  validatorMessageClass?: string;
};

export type InputPasswordEmits = {
  'update:modelValue': [payload?: string];
};

declare const InputPassword: DefineComponent<
  InputPasswordProps,
  InputPasswordEmits
>;

export default InputPassword;
