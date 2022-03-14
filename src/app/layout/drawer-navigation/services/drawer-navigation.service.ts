import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DRAWER_NAVIGATION_SECTIONS_COLLECTION } from '../constants/drawer-navigation-sections';
import { DrawerNavigationSection } from '../interfaces/drawer-navigation-element.interface';

@Injectable()
export class DrawerNavigationService {
  constructor() {}

  get navigationSections$(): Observable<DrawerNavigationSection[]> {
    return of(Object.values(DRAWER_NAVIGATION_SECTIONS_COLLECTION));
  }
}
