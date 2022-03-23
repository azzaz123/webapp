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

export interface DrawerNavigationBalanceElement extends DrawerNavigationElement {
  balance: string;
}

export interface DrawerNavigationProfileElement extends DrawerNavigationElement {
  professional: boolean;
  avatar: string;
  reviews: number;
  reviews_count: number;
}
