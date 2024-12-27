import { DefineComponent } from 'vue';
import { InputTextEmits, InputTextProps } from '../inputtext/InputText.vue.d';

/**
 * InputEmail component props
 */
export type InputEmailProps = Omit<InputTextProps, 'type'>;

/**
 * InputEmail component emits
 */
export type InputEmailEmits = InputTextEmits;
/**
 * **WangsVue - InputEmail**
 *
 * _Handle input email with form validation._
 *
 * --- ---
 * ![WangsVue](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group form
 */
declare const InputEmail: DefineComponent<InputEmailProps, InputEmailEmits>;

export default InputEmail;
