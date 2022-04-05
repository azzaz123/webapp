import { Component, Input } from '@angular/core';
import { DrawerNavigationElement } from '@layout/drawer-navigation/interfaces/drawer-navigation-element.interface';

@Component({
  selector: 'tsl-drawer-navigation-element',
  template: '',
})
export class DrawerNavigationElementStubComponent {
  @Input() element: DrawerNavigationElement;
}
