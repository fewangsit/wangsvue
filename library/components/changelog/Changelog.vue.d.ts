import { MultiSelectOption } from 'lib/types/options.type';
import { ClassComponent, GlobalComponentConstructor } from '../ts-helpers';

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
   * Title content of the dialog.
   */
  header?: string | undefined;
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
}

/**
 * Emits for Changelog component
 */
export type ChangelogEmits = {
  hide: [];
};

/**
 * **TSVue v2 - Changelog**
 *
 * _Changelog is a component for to show changelog dialog.
 * You need to install vee-validate while using this component._
 *
 * --- ---
 * ![TSVue](https://ik.imagekit.io/kurniadev/TS-HEAD-BLACK.png)
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
