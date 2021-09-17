import { Provider, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { UserService } from './core/user/user.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './core/custom-route-reuse-strategy/custom-route-reuse-strategy';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { DEFAULT_PERMISSIONS } from '@core/user/user-constants';
import { FeatureFlag, INIT_FEATURE_FLAGS } from '@core/user/featureflag-constants';
import { MonitoringService } from '@core/monitoring/services/monitoring.service';
import { MARKET_PROVIDER, MarketSiteByLocale } from '../configs/market.config';
import { siteUrlFactory, SITE_URL } from '@configs/site-url.config';
import { WINDOW_TOKEN } from '@core/window/window.token';

export const PROVIDERS: Provider[] = [
  {
    provide: SITE_URL,
    useFactory: siteUrlFactory,
    deps: [WINDOW_TOKEN],
  },
  {
    provide: MARKET_PROVIDER,
    useFactory: MarketSiteByLocale,
    deps: [LOCALE_ID],
  },
  {
    provide: APP_INITIALIZER,
    useFactory: userPermissionsFactory,
    deps: [UserService, NgxPermissionsService],
    multi: true,
  },
  {
    provide: APP_INITIALIZER,
    useFactory: defaultPermissionsFactory,
    deps: [FeatureFlagService, NgxPermissionsService],
    multi: true,
  },
  {
    provide: APP_INITIALIZER,
    useFactory: initializeMonitoring,
    deps: [MonitoringService],
    multi: true,
  },
  {
    provide: RouteReuseStrategy,
    useClass: CustomRouteReuseStrategy,
  },
];

export function userPermissionsFactory(userService: UserService): () => Promise<boolean> {
  return () => userService.isLogged && userService.initializeUserWithPermissions().toPromise();
}

export function defaultPermissionsFactory(
  featureFlagService: FeatureFlagService,
  permissionService: NgxPermissionsService
): () => Promise<FeatureFlag[]> {
  permissionService.addPermission(DEFAULT_PERMISSIONS);
  return () =>
    featureFlagService
      .getFlags(INIT_FEATURE_FLAGS)
      .toPromise()
      .catch(() => []);
}

export function initializeMonitoring(monitoringService: MonitoringService): () => void {
  return () => monitoringService.initialize();
}
