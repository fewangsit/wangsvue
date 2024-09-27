import { DefineComponent } from 'vue';

export type WorkCalendarState = 'view' | 'edit';

/**
 * WorkCalendar component props
 */
export interface WorkCalendarProps {
  /**
   * Initial Value or saved Workdays in a year
   * Date string in format: "yyyy-mm-dd" (ISO 8601 format)
   *
   * @example {
   *  2020: ['2020-05-01'],
   *  2021: ['2021-05-01'],
   *  2022: ['2021-05-01'],
   * }
   */
  workDays?: Record<number, string[]>;
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
 * ![WangsVue](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group form
 */
declare const WorkCalendar: DefineComponent<
  WorkCalendarProps,
  WorkCalendarEmits
>;

export default WorkCalendar;
