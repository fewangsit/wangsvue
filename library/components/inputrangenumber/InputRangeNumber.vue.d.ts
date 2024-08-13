import { DefineComponent } from 'vue';

/**
 * InputRangeNumber component props
 */
export interface InputRangeNumberProps {
  /**
   * Number modelValue of the input.
   */
  modelValue?: number[];
  /**
   * The input label. Tell the user what input is this.
   */
  label?: string;
  /**
   * Placeholder for both input
   *
   * @default 'Tulis'
   */
  placeholder?: string;
  /**
   * Specify the min number input placeholder.
   *
   * @default 'Tulis'
   */
  minPlaceholder?: string;
  /**
   * Specify the max number input placeholder.
   *
   * @default 'Tulis'
   */
  maxPlaceholder?: string;
  /**
   * Disabled the input.
   */
  disabled?: boolean;
}

/**
 * InputRangeNumber component emits
 */
export type InputRangeNumberEmits = {
  /**
   * Emits when the both input already filled.
   */
  'update:modelValue': [payload?: number[]];
};

/**
 * **WangsVUe - InputRangeNumber**
 *
 * _Handle input range number._
 *
 * --- ---
 * ![WangsVUe](https://ik.imagekit.io/kurniadev/TS-HEAD-BLACK.png)
 *
 * @group form
 */
declare const InputRangeNumber: DefineComponent<
  InputRangeNumberProps,
  InputRangeNumberEmits,
  unknown
>;

export default InputRangeNumber;
