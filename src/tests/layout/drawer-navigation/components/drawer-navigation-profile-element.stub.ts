import { Component, Input } from '@angular/core';
import { DrawerNavigationProfileElement } from '@layout/drawer-navigation/interfaces/drawer-navigation-element.interface';

@Component({
  selector: 'tsl-drawer-navigation-profile-element',
  template: '',
})
export class DrawerNavigationProfileElementStubComponent {
  @Input() element: DrawerNavigationProfileElement;
}
