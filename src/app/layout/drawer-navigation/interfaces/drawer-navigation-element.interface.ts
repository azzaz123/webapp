import { NavigationElement } from '@layout/core/interfaces/navigation-element.interface';

export enum DRAWER_NAVIGATION_SECTIONS {
  // PROFILE,
  CATALOG,
  // TRANSACTIONS,
  // ACCOUNT,
  // HELP
}

export interface DrawerNavigationElement extends NavigationElement {
  children?: DrawerNavigationElement[];
}

export interface DrawerNavigationSection {
  title: string;
  elements: DrawerNavigationElement[] | DrawerNavigationProfileElement;
}

export interface DrawerNavigationProfileElement extends DrawerNavigationElement {
  avatar: string;
  reviews: number;
}
