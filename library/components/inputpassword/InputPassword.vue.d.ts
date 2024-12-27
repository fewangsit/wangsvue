import { DefineComponent } from 'vue';
import { CustomValidation } from '../form/Form.vue.d';

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
  /**
   * Set custom validator message.
   * Will be show if invalid="true"
   */
  validatorMessage?: string | CustomValidation;
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
