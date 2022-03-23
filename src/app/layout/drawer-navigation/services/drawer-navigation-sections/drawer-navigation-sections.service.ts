import { Injectable } from '@angular/core';
import { DrawerNavigationSection } from '@layout/drawer-navigation/interfaces/drawer-navigation-element.interface';

@Injectable()
export class DrawerNavigationSectionsService {
  constructor() {}

  public get navigationSections$(): Record<DRAWER_NAVIGATION_SECTIONS, DrawerNavigationSection> {}
}
