import { Injectable } from '@angular/core';
import { UserService } from '@core/user/user.service';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DRAWER_NAVIGATION_SECTIONS_COLLECTION } from '../constants/drawer-navigation-sections';
import {
  DrawerNavigationElement,
  DrawerNavigationProfileElement,
  DrawerNavigationSection,
} from '../interfaces/drawer-navigation-element.interface';

@Injectable()
export class DrawerNavigationService {
  constructor(private userService: UserService) {}

  get navigationSections$(): Observable<DrawerNavigationSection[]> {
    return of(Object.values(DRAWER_NAVIGATION_SECTIONS_COLLECTION));
  }

  get profileNavigationElement$(): Observable<DrawerNavigationProfileElement> {
    return combineLatest([this.userService.user$]).pipe(
      map(([user]) => {
        return {
          professional: true,
          text: user.microName,
          alternativeText: user.microName,
          reviews: 100,
          reviews_count: 30,
          avatar: '',
          href: '/profile/info',
          external: false,
        };
      })
    );
  }

  public getChildNavigationElements(route: string): Observable<DrawerNavigationElement[]> {
    return this.navigationSections$.pipe(map((sections) => this.findChildNavigationElements(sections, route)));
  }

  public getChildNavigationTitle(route: string): Observable<string> {
    return this.navigationSections$.pipe(map((sections) => this.findChildNavigationTitle(sections, route)));
  }

  private findChildNavigationTitle(sections: DrawerNavigationSection[], route: string): string {
    return sections.reduce((acc, section) => {
      return section.elements.find((element) => element.href === route)?.text ?? acc;
    }, '');
  }

  private findChildNavigationElements(sections: DrawerNavigationSection[], route: string): DrawerNavigationElement[] {
    return sections.reduce((acc, section) => {
      return section.elements.find((element) => element.href === route)?.children ?? acc;
    }, []);
  }
}
