import { Injectable } from '@angular/core';
import { DeviceService } from '@core/device/device.service';
import { User } from '@core/user/user';
import { UserStats } from '@core/user/user-stats.interface';
import { UserService } from '@core/user/user.service';
import { PROFILE_PATHS } from '@private/features/profile/profile-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SIDEBAR_NAVIGATION_ELEMENTS } from '../../interfaces/sidebar-navigation-element.interface';
import { SidebarNavigationProfileElement } from '../../interfaces/sidebar-navigation-profile-element.interface';

const SIDEBAR_COLLAPSED_PREFERENCE_KEY = 'sidebarCollapsed';

@Injectable()
export class SidebarService {
  private readonly _sidebarCollapsed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.getCollapsedPreference());

  constructor(private deviceService: DeviceService, private userService: UserService) {}

  public get profileNavigationElement$(): Observable<SidebarNavigationProfileElement> {
    return combineLatest([this.userService.user$, this.userService.getStats()]).pipe(
      map(([user, stats]) => this.mapProfileNavigationElement(user, stats))
    );
  }

  public get sidebarCollapsed$(): Observable<boolean> {
    return this._sidebarCollapsed$.asObservable();
  }

  public toggleCollapse(): void {
    this.setCollapsedState(!this.sidebarCollapsed);
  }

  private get sidebarCollapsed(): boolean {
    return this._sidebarCollapsed$.getValue();
  }

  private setCollapsedState(state: boolean): void {
    this._sidebarCollapsed$.next(state);
    this.saveCollapsedPreference(state);
  }

  private saveCollapsedPreference(state: boolean): void {
    localStorage.setItem(SIDEBAR_COLLAPSED_PREFERENCE_KEY, state.toString());
  }

  private getCollapsedPreference(): boolean {
    const collapsed: string | null = localStorage.getItem(SIDEBAR_COLLAPSED_PREFERENCE_KEY);

    if (collapsed === null && this.deviceService.isTablet()) {
      return true;
    }
    if (collapsed === 'true') {
      return true;
    }
    if (collapsed === 'false') {
      return false;
    }
    return false;
  }

  private mapProfileNavigationElement(user: User, stats: UserStats): SidebarNavigationProfileElement {
    return {
      id: SIDEBAR_NAVIGATION_ELEMENTS.PROFILE,
      isPro: user.featured,
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
