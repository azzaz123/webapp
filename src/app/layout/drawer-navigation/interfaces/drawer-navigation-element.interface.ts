import { NavigationElement } from '@layout/core/interfaces/navigation-element.interface';

export enum DRAWER_NAVIGATION_SECTIONS {
  CATALOG,
  TRANSACTIONS,
  ACCOUNT,
  HELP,
}

export enum DRAWER_NAVIGATION_ELEMENTS {
  ITEMS,
  SHIPPING,
  WALLET,
  PROS,
  SETTINGS,
  EDIT_PROFILE,
  VERIFICATIONS,
  SHIPPING_ADDRESS,
  NOTIFICATIONS,
  LOGOUT,
  HELP,
}

export interface DrawerNavigationElement extends NavigationElement {
  id: DRAWER_NAVIGATION_ELEMENTS;
  children?: DrawerNavigationElement[];
}

export interface DrawerNavigationSection {
  id: DRAWER_NAVIGATION_SECTIONS;
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
