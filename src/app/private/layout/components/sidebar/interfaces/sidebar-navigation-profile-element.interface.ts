import { SidebarNavigationElement } from './sidebar-navigation-element.interface';

export interface SidebarNavigationProfileElement extends SidebarNavigationElement {
  isPro: boolean;
  avatar: string;
  reviews: number;
  reviews_count: number;
}
