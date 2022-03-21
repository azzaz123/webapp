import { Injectable } from '@angular/core';
import { User } from '@core/user/user';
import { Image } from '@core/user/user-response.interface';
import { UserStats } from '@core/user/user-stats.interface';
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
    return combineLatest([this.userService.user$, this.userService.getStats(), this.userService.getUserCover()]).pipe(
      map(([user, stats, cover]) => this.mapProfileNavigationElement(user, stats, cover))
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

  private mapProfileNavigationElement(user: User, stats: UserStats, cover: Image): DrawerNavigationProfileElement {
    return {
      professional: user.featured,
      text: user.microName,
      alternativeText: user.microName,
      reviews: stats.ratings.reviews,
      reviews_count: stats.counters.reviews,
      avatar: cover?.urls_by_size.medium,
      href: '/profile/info',
      external: false,
    };
  }
}
