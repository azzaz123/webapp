import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DrawerNavigationSection } from '../interfaces/drawer-navigation-element.interface';
import { DrawerNavigationService } from '../services/drawer-navigation.service';

@Component({
  selector: 'tsl-drawer-navigation',
  templateUrl: './drawer-navigation.component.html',
  styleUrls: ['./drawer-navigation.component.scss'],
})
export class DrawerNavigationComponent {
  public readonly navigationSections$: Observable<DrawerNavigationSection[]> = this.drawerNavigationService.navigationSections$;

  constructor(private drawerNavigationService: DrawerNavigationService) {}
}
