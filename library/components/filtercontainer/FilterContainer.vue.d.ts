import { DefineComponent, Slot } from 'vue';

/**
 * Emits for FilterContainer component
 */
export type FilterContainerEmits = {
  apply: [];
  clear: [];
};

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
  object,
  FilterContainerEmits,
  FilterContainerSlots
>;

export default FilterContainer;
