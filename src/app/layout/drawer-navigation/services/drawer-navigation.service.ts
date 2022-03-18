import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DRAWER_NAVIGATION_SECTIONS_COLLECTION } from '../constants/drawer-navigation-sections';
import { DrawerNavigationElement, DrawerNavigationSection } from '../interfaces/drawer-navigation-element.interface';

@Injectable()
export class DrawerNavigationService {
  constructor() {}

  get navigationSections$(): Observable<DrawerNavigationSection[]> {
    return of(Object.values(DRAWER_NAVIGATION_SECTIONS_COLLECTION));
  }

  public getChildNavigationElements(route: string) {
    return this.navigationSections$.pipe(
      map((sections) => this.findChildNavigationElements(sections, route)),
      tap((x) => console.log(x))
    );
  }

  private findChildNavigationElements(sections: DrawerNavigationSection[], route: string): DrawerNavigationElement[] {
    return sections.reduce((acc, section) => {
      return section.elements.find((y) => y.href === route)?.children ?? acc;
    }, []);
  }
}
