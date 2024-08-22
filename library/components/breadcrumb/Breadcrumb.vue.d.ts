import { DefineComponent } from 'vue';

export type BreadcrumbMenu = {
  name: string;
  route?: string;
  title?: string;
};

export interface BreadcrumbProps {
  /**
   * The list of breadcrumb menu to display.
   */
  menus: BreadcrumbMenu[];
}

/**
 * **WangsVue - Breadcrumb**
 *
 * _Breadcrumb is a component for displaying a breadcrumb trail to help users navigate a website or application.
 * It takes an array of menu items as a prop and displays each item as a link or label, with a separator between them._
 *
 * @group components
 */
declare const Breadcrumb: DefineComponent<BreadcrumbProps>;

export default Breadcrumb;
