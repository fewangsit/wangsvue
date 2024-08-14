import { MultiSelectOption } from 'lib/types/options.type';
import { QueryParams } from '../datatable/DataTable.vue.d';
import { DefineComponent } from 'vue';

export interface QuickFilterField {
  field: string;
  type: 'rangenumber' | 'multiselect';
  fetchOptionFn?:
    | ((arrgs?: any) => MultiSelectOption[])
    | ((arrgs?: any) => Promise<MultiSelectOption[]>);
  placeholder?: string;
  tooltip?: string;
}

export interface QuickFilterProps {
  fields: QuickFilterField[];
}

export type QuickFilterEmits = {
  change: [filters: QueryParams];
};

/**
 * **WangsVue - QuickFilter**
 *
 * @group components
 */
declare const QuickFilter: DefineComponent<
  QuickFilterProps,
  QuickFilterEmits,
  unknown
>;

export default QuickFilter;
