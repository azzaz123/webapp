import { Component, Input } from '@angular/core';
import { SidebarNavigationProfileElement } from '@private/layout/components/sidebar/interfaces/sidebar-navigation-profile-element.interface';

@Component({
  selector: 'tsl-sidebar-navigation-profile-element',
  template: '',
})
export class SidebarNavigationProfileElementStubComponent {
  @Input() element: SidebarNavigationProfileElement;
  @Input() collapsed: boolean;
}
