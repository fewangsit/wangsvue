import { MultiSelectOption } from 'lib/types/options.type';
import { ClassComponent, GlobalComponentConstructor } from '../ts-helpers';
import { TableColumn } from '../datatable/DataTable.vue.d';
import { FilterField } from '../filtercontainer/FilterContainer.vue.d';

export type ChangelogTemplateColumn = { index: number; column: TableColumn };
export type ChangelogTemplateFilter = { index: number; filter: FilterField };

export type ChangelogType = {
  _id: string;
  action: string;
  field: string;
  oldValue?: string;
  newValue?: string;
  modifiedBy?: string;
  object: string;
  objectName: string;
  createdAt: string;
  oldValueNum?: number;
  newValueNum?: number;
};

export type ChangelogFilter = {
  objects?: string[];
  field?: string[];
  action?: string[];
  modifiedBy?: number[];
  createdAt?: number[];
};

export type ChangelogFilterQuery = {
  [key: string]: string | undefined;
};

export type ChangelogOptionQuery = {
  actionOptions?: boolean;
  modifiedByOptions?: boolean;
  objectOptions?: boolean;
  fieldOptions?: boolean;
  nameOptions?: boolean;
  assetNameOptions?: boolean;
  object?: string;
  objects?: string;
};

export type ChangelogOptionFilter = {
  actionOptions?: MultiSelectOption[];
  modifiedByOptions?: MultiSelectOption[];
  objectOptions?: MultiSelectOption[];
  fieldOptions?: MultiSelectOption[];
  nameOptions?: MultiSelectOption[];
  assetNameOptions?: MultiSelectOption[];
};

/**
 * Props for Changelog component
 */
export interface ChangelogProps {
  /**
   * Props to determine whether this component should using button or not
   * For ChangelogPage
   * @ignore
   */
  useButton?: boolean;
  /**
   * To set custom name for specific column in changelog table
   */
  objectNameColumn?: string;
  /**
   * Title content of the dialog.
   * @example 'Changelog: Roles > Transfer'
   */
  header?: string | undefined;
  /**
   * To give additional columns in changelog table
   */
  additionalTemplateColumns?: ChangelogTemplateColumn[];
  /**
   * To give additional filters in changelog filter
   */
  additionalTemplateFilters?: ChangelogTemplateFilter[];
  /**
   * Changelog object.
   * Note: Even if this props is mandatory, if you fill props `objects` then props `object` will not be processed in component.
   */
  object: string;
  /**
   * Changelog objects.
   * Note: This props will override props Object
   */
  objects?: string[];
  /**
   * Changelog object ID.
   */
  objectId?: string;
  /**
   * Changelog custom params, contains stringified filter query needed.
   */
  customParams?: ChangelogFilterQuery;
  /**
   * Use this props if changelog need button download
   * @default false
   */
  useButtonDownload?: boolean;
  /**
   * File name is a must if there's button download
   * @default 'Changelog' only
   */
  fileName?: string;
  /**
   * Now changelog support custom table name from outside
   */
  tableName?: string;
}

/**
 * Emits for Changelog component
 */
export type ChangelogEmits = {
  hide: [];
};

/**
 * **WangsVue - Changelog**
 *
 * _Changelog is a component for to show changelog dialog.
 * You need to install vee-validate while using this component._
 *
 * --- ---
 * ![WangsVue](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group components
 */
declare class Changelog extends ClassComponent<
  ChangelogProps,
  unknown,
  ChangelogEmits
> {}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    Changelog: GlobalComponentConstructor<Changelog>;
  }
}

export default Changelog;
