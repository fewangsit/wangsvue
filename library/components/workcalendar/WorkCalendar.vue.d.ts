import { DefineComponent } from 'vue';

export type WorkCalendarState = 'view' | 'edit';

/**
 * WorkCalendar component props
 */
export interface WorkCalendarProps {
  /**
   * Initial Value or saved Workdays in a year
   * Ddate string in format: "yyyy-mm-dd" (ISO 8601 format)
   */
  workDays?: string[];
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
