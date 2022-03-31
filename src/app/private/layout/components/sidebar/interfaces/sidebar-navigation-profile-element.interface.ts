import { SidebarNavigationElement } from './sidebar-navigation-element.interface';

export interface SidebarNavigationProfileElement extends SidebarNavigationElement {
  professional: boolean;
  avatar: string;
  reviews: number;
  reviews_count: number;
}
