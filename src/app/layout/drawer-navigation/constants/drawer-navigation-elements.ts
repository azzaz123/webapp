import { DrawerNavigationSection, DRAWER_NAVIGATION_SECTIONS } from '../interfaces/drawer-navigation-element.interface';

export const NAVIGATION_DRAWER_ELEMENTS: Record<DRAWER_NAVIGATION_SECTIONS, DrawerNavigationSection> = {
  [DRAWER_NAVIGATION_SECTIONS.CATALOG]: {
    title: 'Catalog',
    elements: [
      {
        text: 'Productos',
        alternativeText: 'Productos',
        icon: '',
        external: false,
        href: '/catalog/list',
      },
    ],
  },
};
