import { Provider, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { UserService } from './core/user/user.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './core/custom-route-reuse-strategy/custom-route-reuse-strategy';
import { FeatureflagService } from '@core/user/featureflag.service';
import { DEFAULT_PERMISSIONS } from '@core/user/user-constants';
import { FeatureFlag, INIT_FEATURE_FLAGS } from '@core/user/featureflag-constants';
import { MonitoringService } from '@core/monitoring/services/monitoring.service';
import { APP_LOCALE, SUBDOMAIN, SUBDOMAINS } from 'configs/subdomains.config';

export const PROVIDERS: Provider[] = [
  {
    provide: 'SUBDOMAIN',
    useFactory: subdomainFactory,
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
    deps: [FeatureflagService, NgxPermissionsService],
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

export function subdomainFactory(locale: APP_LOCALE): SUBDOMAIN | string {
  return SUBDOMAINS[locale] || 'www';
}

export function userPermissionsFactory(userService: UserService): () => Promise<boolean> {
  return () => userService.isLogged && userService.initializeUserWithPermissions().toPromise();
}

export function defaultPermissionsFactory(
  featureFlagService: FeatureflagService,
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
