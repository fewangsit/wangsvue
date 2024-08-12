import { DefineComponent } from 'vue';

export interface FieldWrapperProps {
  label?: string;
  mandatory?: boolean;
  info?: string;
  labelClass?: string;
}

declare const FieldWrapper: DefineComponent<FieldWrapperProps>;

export default FieldWrapper;