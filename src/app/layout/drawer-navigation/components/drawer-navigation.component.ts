import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DrawerNavigationProfileElement, DrawerNavigationSection } from '../interfaces/drawer-navigation-element.interface';
import { DrawerNavigationService } from '../services/drawer-navigation.service';

@Component({
  selector: 'tsl-drawer-navigation',
  templateUrl: './drawer-navigation.component.html',
  styleUrls: ['./drawer-navigation.component.scss'],
})
export class DrawerNavigationComponent {
  public readonly navigationSections$: Observable<DrawerNavigationSection[]> = this.drawerNavigationService.navigationSections$;
  public readonly profileNavigationElement$: Observable<DrawerNavigationProfileElement> =
    this.drawerNavigationService.profileNavigationElement$;

  constructor(private drawerNavigationService: DrawerNavigationService) {}
}
