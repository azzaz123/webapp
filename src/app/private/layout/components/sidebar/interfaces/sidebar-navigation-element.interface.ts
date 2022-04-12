import { NavigationElement } from '@layout/core/interfaces/navigation-element.interface';

export enum SIDEBAR_NAVIGATION_ELEMENTS {
  PROFILE,
}

export interface SidebarNavigationElement extends NavigationElement {
  id: SIDEBAR_NAVIGATION_ELEMENTS;
  children?: SidebarNavigationElement[];
}
