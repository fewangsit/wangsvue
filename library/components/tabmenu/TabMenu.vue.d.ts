/**
 *
 * TabMenu is a navigation component that displays items as tab headers. Example below uses nested routes with TabMenu.
 *
 * [Live Demo](https://www.WangsVue.org/tabmenu/)
 *
 * @module tabmenu
 *
 */
import { VNode } from 'vue';
import { ComponentHooks } from '../basecomponent';
import { MenuItem } from '../menuitem';
import { PassThroughOptions } from '../passthrough';
import { ClassComponent, PassThrough } from '../ts-helpers';

export declare type TabMenuPassThroughOptionType =
  | TabMenuPassThroughAttributes
  | ((
      options: TabMenuPassThroughMethodOptions,
    ) => TabMenuPassThroughAttributes | string)
  | string
  | null
  | undefined;

/**
 * Custom passthrough(pt) option method.
 */
export interface TabMenuPassThroughMethodOptions {
  /**
   * Defines instance.
   */
  instance: any;
  /**
   * Defines valid properties.
   */
  props: TabMenuProps;
  /**
   * Defines current inline state.
   */
  state: TabMenuState;
  /**
   * Defines current options.
   */
  context: TabMenuContext;
  /**
   * Defines valid attributes.
   */
  attrs: any;
  /**
   * Defines parent options.
   */
  parent: any;
  /**
   * Defines passthrough(pt) options in global config.
   */
  global: object | undefined;
}

/**
 * Custom passthrough(pt) options.
 * @see {@link TabMenuProps.pt}
 */
export interface TabMenuPassThroughOptions {
  /**
   * Used to pass attributes to the root's DOM element.
   */
  root?: TabMenuPassThroughOptionType;
  /**
   * Used to pass attributes to the list's DOM element.
   */
  menu?: TabMenuPassThroughOptionType;
  /**
   * Used to pass attributes to the list item's DOM element.
   */
  menuitem?: TabMenuPassThroughOptionType;
  /**
   * Used to pass attributes to the action's DOM element.
   */
  action?: TabMenuPassThroughOptionType;
  /**
   * Used to pass attributes to the icon's DOM element.
   */
  icon?: TabMenuPassThroughOptionType;
  /**
   * Used to pass attributes to the label's DOM element.
   */
  label?: TabMenuPassThroughOptionType;
  /**
   * Used to pass attributes to the inkbar's DOM element.
   */
  inkbar?: TabMenuPassThroughOptionType;
  /**
   * Used to manage all lifecycle hooks.
   * @see {@link BaseComponent.ComponentHooks}
   */
  hooks?: ComponentHooks;
}

/**
 * Custom passthrough attributes for each DOM elements
 */
export interface TabMenuPassThroughAttributes {
  [key: string]: any;
}

/**
 * Defines current inline state in TabMenu component.
 */
export interface TabMenuState {
  /**
   * Current active index state as a number.
   * @defaulValue 0
   */
  d_activeIndex: number;
}

/**
 * Defines current options in TabMenu component.
 */
export interface TabMenuContext {
  /**
   * Current menuitem
   */
  item: any;
  /**
   * Index of the menuitem
   */
  index: number;
}

/**
 * Custom change event.
 * @see {@link TabMenuEmits['tab-change']}
 */
export interface TabMenuChangeEvent {
  /**
   * Browser event
   */
  originalEvent: Event;
  /**
   * Index of the selected tab
   */
  index: number;
}

/**
 * Defines valid router binding props in TabMenu component.
 */
export interface TabMenuRouterBindProps {
  /**
   * Action element binding
   */
  action: object;
  /**
   * Icon element binding
   */
  icon: object;
  /**
   * Label element binding
   */
  label: object;
}

/**
 * Defines valid properties in TabMenu component.
 */
export interface TabMenuProps {
  /**
   * An array of menuitems.
   */
  menu?: MenuItem[] | undefined;
  /**
   * Active index of menuitem.
   * @defaultValue 0
   */
  activeIndex?: number | undefined;
  /**
   * Whether to use trailing line at the end of tab menu.
   * @defaultValue true
   */
  useTrailingLine?: boolean | undefined;
  /**
   * Defines a string value that labels an interactive element.
   */
  ariaLabel?: string | undefined;
  /**
   * Identifier of the underlying input element.
   */
  ariaLabelledby?: string | undefined;
  /**
   * Used to pass attributes to DOM elements inside the component.
   * @type {TabMenuPassThroughOptions}
   */
  pt?: PassThrough<TabMenuPassThroughOptions>;
  /**
   * Used to configure passthrough(pt) options of the component.
   * @type {PassThroughOptions}
   */
  ptOptions?: PassThroughOptions;
  /**
   * When enabled, it removes component related styles in the core.
   * @defaultValue false
   */
  unstyled?: boolean;
}

/**
 * Defines valid slots in TabMenu component.
 */
export interface TabMenuSlots {
  /**
   * Custom content for each item.
   * @param {Object} scope - item slot's params.
   */
  item(scope: {
    /**
     * Menuitem instance
     */
    item: MenuItem;
    /**
     * Index of the menuitem
     */
    index: number;
    /**
     * Current active state of the menuitem
     */
    active: boolean;
    /**
     * Label property of the menuitem
     */
    label: string | ((...args: any) => string) | undefined;
    /**
     * Binding properties of the menuitem
     */
    props: TabMenuRouterBindProps;
  }): VNode[];
  /**
   * Custom item icon template.
   * @param {Object} scope - item icon slot's params.
   */
  itemicon(scope: {
    /**
     * Menuitem instance
     */
    item: MenuItem;
    /**
     * Style class of the item icon element.
     */
    class: any;
  }): VNode[];
}

/**
 * Defines valid emits in TabMenu component.
 */
export type TabMenuEmits = {
  /**
   * Callback to invoke when an active tab is changed.
   * @param {TabMenuChangeEvent} event - Custom tab change event.
   */
  'tab-change': [event: TabMenuChangeEvent];
  'update:activeIndex': [index: number];
};

/**
 * **WangsVue - TabMenu**
 *
 * _TabMenu is a navigation component that displays items as tab headers. Example below uses nested routes with TabMenu._
 *
 * [Live Demo](https://www.WangsVue.org/tabmenu/)
 * --- ---
 * ![WangsVue](https://primefaces.org/cdn/WangsVue/images/logo-100.png)
 *
 * @group Component
 *
 */
declare class TabMenu extends ClassComponent<
  TabMenuProps,
  TabMenuSlots,
  TabMenuEmits
> {}

export default TabMenu;
