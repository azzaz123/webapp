import { NavigationElement } from '@layout/core/interfaces/navigation-element.interface';

export enum NAVIGATION_DRAWER_SECTIONS {
  // PROFILE,
  CATALOG,
  // TRANSACTIONS,
  // ACCOUNT,
  // HELP
}

export interface NavigationDrawerSection {
  title: string;
  elements: NavigationDrawerElement[] | ProfileNavigationDrawerElement;
}

export interface NavigationDrawerElement extends NavigationElement {
  children?: NavigationDrawerElement[];
}

export interface ProfileNavigationDrawerElement extends NavigationDrawerElement {
  avatar: string;
  reviews: number;
}
