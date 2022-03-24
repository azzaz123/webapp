import { Route } from '@angular/compiler/src/core';
import { Inject, Injectable } from '@angular/core';
import { CanLoad, Router, UrlSegment, UrlTree } from '@angular/router';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { APP_PATHS } from 'app/app-routing-constants';
import { Observable } from 'rxjs';

@Injectable()
export class YouGuard implements CanLoad {
  constructor(@Inject(WINDOW_TOKEN) private window: Window, private router: Router) {}

  canLoad(_: Route, segments: UrlSegment[]): boolean {
    const isBottomNavigationBarVisible = this.window.matchMedia('(max-width: 991px)').matches;
    const isChildRoute = segments.length > 1;

    if (isBottomNavigationBarVisible) {
      return true;
    }

    if (isChildRoute) {
      const childRoute = segments.join('/').replace(`${PRIVATE_PATHS.YOU}`, '');

      this.navigate(childRoute);

      return false;
    }

    this.navigate(`/${APP_PATHS.PRIVATE}${PRIVATE_PATHS.CATALOG}`);

    return false;
  }

  private navigate(route: string): void {
    this.router.navigate([route]);
  }
}
