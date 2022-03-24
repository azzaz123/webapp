import { NavigationElement } from '@layout/core/interfaces/navigation-element.interface';

export enum DRAWER_NAVIGATION_SECTIONS {
  CATALOG,
  TRANSACTIONS,
  ACCOUNT,
  HELP,
}

export interface DrawerNavigationElement extends NavigationElement {
  children?: DrawerNavigationElement[];
}

export interface DrawerNavigationSection {
  title: string;
  elements: DrawerNavigationElement[];
}

export interface DrawerNavigationProfileElement extends NavigationElement {
  professional: boolean;
  avatar: string;
  reviews: number;
  reviews_count: number;
}
