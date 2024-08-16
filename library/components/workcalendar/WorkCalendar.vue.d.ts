import { DefineComponent } from 'vue';

export type WorkCalendarState = 'view' | 'edit';

/**
 * WorkCalendar component props
 */
export interface WorkCalendarProps {
  /**
   * WorkCalendar modelValue is date timestamp: 1706423635731
   */
  modelValue?: number | number[];
  /**
   * Default work days in number array 0 - 6
   *
   * @defaultValue '[1, 2, 3, 4, 5]'
   */
  defaultWorkDays?: number[];
  /**
   * @default 'view'
   */
  state?: WorkCalendarState;
  /**
   * Type of view to display.
   * @defaultValue date
   */
  view?: 'date' | 'month' | 'year' | undefined;
}

/**
 * WorkCalendar component emits
 */
export type WorkCalendarEmits = {
  'update:modelValue': [date?: number | number[]];
};

/**
 * **WangsVue - WorkCalendar**
 *
 * _Handle input date with form validation._
 *
 * --- ---
 * ![WangsVue](https://ik.imagekit.io/kurniadev/TS-HEAD-BLACK.png)
 *
 * @group form
 */
declare const WorkCalendar: DefineComponent<
  WorkCalendarProps,
  WorkCalendarEmits
>;

export default WorkCalendar;
