import { CustomValidation } from '../form/Form.vue.d';
import { DefineComponent } from 'vue';

/**
 * Calendar component props
 */
export interface CalendarProps {
  /**
   * Calendar modelValue is date timestamp: 1706423635731
   */
  modelValue?: number | number[];
  /**
   * To display the initial date value, used in edit form, taht sometime need to display the already inputed date.
   */
  dateValue?: number | number[];
  /**
   * Display label on top of Date Input.
   */
  label?: string;
  placeholder?: string;
  /**
   * Whether single date or date range model value.
   *
   * @default 'single'
   */
  mode?: 'range' | 'single';
  /**
   * Type of view to display.
   * @defaultValue date
   */
  view?: 'date' | 'month' | 'year' | undefined;
  /**
   * Wheter show year picker or not
   *
   * @default true
   */
  showYear?: boolean;
  /**
   * Show button Apply and cancel on footer.
   *
   * If shown, the modelValue will be updated on button Apply clicked.
   *
   * @default false;
   */
  showButtons?: boolean;
  /**
   * Enable Validator using vee-validate. Combine with TSForm that handle form validation.
   */
  useValidator?: boolean;
  /**
   * When used as field in From Validation using TSForm,
   * specify the unique field name, match with your needs for API request.
   */
  fieldName?: string;
  /**
   * Whether this field should be filled or not.
   */
  mandatory?: boolean;
  /**
   * Show the text (opsional)
   *
   * @default true if mandatory true
   */
  showOptionalText?: boolean;
  /**
   * Sets the invalid state.
   */
  invalid?: boolean;
  /**
   * Set the custom validator message.
   * By default each field has preserved with its validator message, you don't need to worrying about the message.
   */
  validatorMessage?: string;
  /**
   * Set custom validation message for certain condition
   */
  customValidation?: CustomValidation;
  /**
   * Defines the calendar to use hour picker.
   */
  showTime?: boolean;
  /**
   * Formats the hour picker to 12 hour format.
   * @default true
   */
  useTimeFormat?: boolean;
  /**
   * The minimum selectable date.
   */
  minDate?: Date | undefined;
  /**
   * The maximum selectable date.
   */
  maxDate?: Date | undefined;
  /**
   * The maximum selectable year.
   *
   * The full year: 2020
   */
  maxYear?: 'current' | number | undefined;
  /**
   * The maximum selectable months.
   *
   * Number 0-11
   */
  maxMonth?: 'current' | number | undefined;
}

/**
 * Calendar component emits
 */
export type CalendarEmits = {
  'update:modelValue': [date?: number | number[]];
};

/**
 * **WangsVue - Calendar**
 *
 * _Handle input date with form validation._
 *
 * --- ---
 * ![WangsVue](https://ik.imagekit.io/kurniadev/TS-HEAD-BLACK.png)
 *
 * @group form
 */
declare const Calendar: DefineComponent<CalendarProps, CalendarEmits>;

export default Calendar;
