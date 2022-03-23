import { Injectable } from '@angular/core';
import { User } from '@core/user/user';
import { UserStats } from '@core/user/user-stats.interface';
import { UserService } from '@core/user/user.service';
import { PROFILE_PATHS } from '@private/features/profile/profile-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  DrawerNavigationElement,
  DrawerNavigationProfileElement,
  DrawerNavigationSection,
} from '../interfaces/drawer-navigation-element.interface';
import { DrawerNavigationSectionsService } from './drawer-navigation-sections/drawer-navigation-sections.service';

@Injectable()
export class DrawerNavigationService {
  constructor(private userService: UserService, private drawerNavigationSectionsService: DrawerNavigationSectionsService) {}

  public get navigationSections$(): Observable<DrawerNavigationSection[]> {
    return this.drawerNavigationSectionsService.navigationSections$;
  }

  public get profileNavigationElement$(): Observable<DrawerNavigationProfileElement> {
    return combineLatest([this.userService.user$, this.userService.getStats()]).pipe(
      map(([user, stats]) => this.mapProfileNavigationElement(user, stats))
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

  private mapProfileNavigationElement(user: User, stats: UserStats): DrawerNavigationProfileElement {
    return {
      professional: user.featured,
      text: user.microName,
      alternativeText: user.microName,
      reviews: stats.ratings.reviews,
      reviews_count: stats.counters.reviews,
      avatar: user.image?.urls_by_size.medium,
      href: `/${PRIVATE_PATHS.PROFILE}/${PROFILE_PATHS.INFO}`,
      external: false,
    };
  }
}
