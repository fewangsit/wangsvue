import { MultiSelectOption } from 'lib/types/options.type';
import { DefineComponent, Slot } from 'vue';
import { MultiSelectProps } from '../multiselect/MultiSelect.vue.d';
import { InputRangeNumberProps } from '../inputrangenumber/InputRangeNumber.vue.d';
import { CalendarProps } from '../calendar/Calendar.vue.d';

// More specific filter field types
export interface MultiSelectFilterField extends MultiSelectProps {
  type: 'multiselect';
  field: string; // The name of the field this filter applies to
  fetchOptionFn?:
    | ((args?: any) => MultiSelectOption[]) // Sync function to fetch options
    | ((args?: any) => Promise<MultiSelectOption[]>); // Async function
}

export interface RangeNumberFilterField extends InputRangeNumberProps {
  type: 'rangenumber';
  /**
   * Specify min and max field
   *
   * @example ['minAge', 'maxAge']
   */
  fields: string[];
}

export interface CalendarFilterField extends CalendarProps {
  type: 'calendar';
  field: string;
}

export type FilterField =
  | MultiSelectFilterField
  | RangeNumberFilterField
  | CalendarFilterField;

export type FilterOptions = Record<string, MultiSelectOption[]>;
export type LoadingFilters = Record<string, boolean>;

export interface FilterContainerProps {
  /**
   * Specify the table name integrated with this filter.
   *
   * @default datatable - the default table name
   */
  tableName?: string;
  fields: FilterField[];
}

/**
 * Slots for FilterContainer component
 */
export type FilterContainerSlots = {
  default: Slot;
};

/**
 * **TSVue - FilterContainer**
 *
 * _FilterContainer is a component for generating a dynamic grid-based layout for any count of filter fields.
 * It calculates the number of children in the container and sets their grid area style dynamically.
 *
 * The grid layout is determined by the row and column position, which are incremented based on the child count.
 * If the child count is odd and the child is the last one (which is Buttons Action),
 * it is placed in the 4th column._
 *
 * @group components
 */
declare const FilterContainer: DefineComponent<
  FilterContainerProps,
  unknown,
  FilterContainerSlots
>;

export default FilterContainer;
