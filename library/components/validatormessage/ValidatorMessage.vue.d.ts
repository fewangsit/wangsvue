import { DefineComponent } from 'vue';

export interface ValidatorMessageProps {
  /**
   * Shows validator message if message exist.
   */
  message?: string;
}

declare const ValidatorMessage: DefineComponent<ValidatorMessageProps>;

export default ValidatorMessage;
