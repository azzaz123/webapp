import { Component, Input, OnInit } from '@angular/core';
import { DrawerNavigationElement } from '@layout/drawer-navigation/interfaces/drawer-navigation-element.interface';

@Component({
  selector: 'tsl-drawer-navigation-element',
  templateUrl: './drawer-navigation-element.component.html',
  styleUrls: ['./drawer-navigation-element.component.scss'],
})
export class DrawerNavigationElementComponent {
  @Input() element: DrawerNavigationElement;
}
