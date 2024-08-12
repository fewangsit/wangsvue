import { DefineComponent } from 'vue';

export interface ValidatorMessageProps {
  /**
   * Shows validator message if message exist.
   */
  message?: string;
  /**
   * Wether format the message into LowerCasen and capital for first character.s
   *
   * @example
   * - 'Message From Props' become 'Message from props'
   *
   * @default true;
   */
  format?: boolean;
}

declare const ValidatorMessage: DefineComponent<ValidatorMessageProps>;

export default ValidatorMessage;
