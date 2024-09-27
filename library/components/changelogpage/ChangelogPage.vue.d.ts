import { MultiSelectOption } from 'lib/types/options.type';
import { ClassComponent, GlobalComponentConstructor } from '../ts-helpers';
import {
  ChangelogDefaultField,
  ChangelogTemplateColumn,
  ChangelogTemplateFilter,
} from '../changelog/Changelog.vue.d';

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
  moduleId?: string;
  subModuleId?: string;
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
export interface BaseChangelogPageProps {
  /**
   * Note: Dont use this props since it's just for changelog dialog purpose
   * @ignore
   */
  isDialog?: boolean;
  /**
   * To give additional columns in changelog table
   */
  additionalTemplateColumns?: ChangelogTemplateColumn[];
  /**
   * To give additional filters in changelog filter
   */
  additionalTemplateFilters?: ChangelogTemplateFilter[];
  /**
   * Array to determine that these columns will be hidden
   */
  removedColumns?: ChangelogDefaultField[];
  /**
   * Array to determine that these filter fields will be hidden
   */
  removedFilters?: Omit<ChangelogDefaultField, 'oldValue' | 'newValue'>[];
  /**
   * To set custom name for specific column in changelog table
   */
  objectNameColumn?: string;
  /**
   * Title content of the dialog.
   */
  header?: string | undefined;
  /**
   * Changelog module Id.
   */
  moduleId?: string;
  /**
   * Changelog sub module Id.
   */
  subModuleId?: string;
  /**
   * Changelog object.
   * Note: Even if this props is mandatory, if you fill props `objects` then props `object` will not be processed in component.
   * @description If changelog using moduleId or subModuleId, just fill props object with any string (will not be used)
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
  defaultParamsQuery?: ChangelogFilterQuery;
  /**
   * Changelog custom params, contains stringified filter query needed.
   */
  customParams?: ChangelogFilterQuery;
  /**
   * Now changelog support custom table name from outside
   */
  tableName?: string;
}

export interface ButtonDownloadTrue extends BaseChangelogPageProps {
  /**
   * Use this props if changelog need button download
   */
  useButtonDownload: true;
  /**
   * File name is a must if there's button download
   * @default 'Changelog' only
   */
  fileName: string;
}

export interface ButtonDownloadFalse extends BaseChangelogPageProps {
  /**
   * Use this props if changelog need button download
   */
  useButtonDownload: false;
  /**
   * File name is a must if there's button download
   * @default 'Changelog' only
   */
  fileName?: string;
}

export type ChangelogPageProps = ButtonDownloadFalse | ButtonDownloadTrue;

/**
 * Emits for Changelog component
 */
export type ChangelogPageEmits = {
  hide: [];
};

/**
 * **WangsVue - Changelog**
 *
 * _Changelog is a component for to show changelog dialog.
 * You need to install vee-validate while using this component._
 *
 * --- ---
 * ![WangsVue](https://ik.imagekit.io/kurniadev/TS-HEAD-BLACK.png)
 *
 * @group components
 */
declare class ChangelogPage extends ClassComponent<
  ChangelogPageProps,
  unknown,
  ChangelogPageEmits
> {}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    Changelog: GlobalComponentConstructor<ChangelogPage>;
  }
}

export default ChangelogPage;
