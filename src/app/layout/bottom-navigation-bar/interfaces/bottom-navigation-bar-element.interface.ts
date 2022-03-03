import { NavigationElement } from '@layout/core/interfaces/navigation-element.interface';

export interface BottomNavigationBarElement extends NavigationElement {
  activeIcon: string;
  pendingNotification?: boolean;
}
