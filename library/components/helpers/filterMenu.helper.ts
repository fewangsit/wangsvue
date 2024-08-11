import { MenuItem } from '../menuitem/MenuItem.vue.d';

/**
 * Filters the menu items to return only the visible ones.
 * If no visible menu items are found, it returns a menu with a label 'No Option Available'.
 *
 * @param menuItems - The array of menu items to filter.
 * @returns - The array of visible menu items or an array with a single menu item with label 'No Option Available'.
 */
const filterVisibleMenu = (menuItems: MenuItem[]): MenuItem[] => {
  const emptyMenu: MenuItem = {
    label: 'No Option Available',
    disabled: true,
  };

  const visibleMenu = menuItems.filter((menu) => menu.visible !== false);

  return visibleMenu.length ? visibleMenu : [emptyMenu];
};

export default filterVisibleMenu;
