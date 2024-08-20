import { DefineComponent } from 'vue';
import { FilterField } from '../filtercontainer/FilterContainer.vue.d';

export interface QuickFilterProps {
  fields: FilterField[];
  tableName?: string;
}

/**
 * **WangsVue - QuickFilter**
 *
 * @group components
 */
declare const QuickFilter: DefineComponent<QuickFilterProps, unknown, unknown>;

export default QuickFilter;
