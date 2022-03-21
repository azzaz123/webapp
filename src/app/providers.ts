import { Provider, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { UserService } from './core/user/user.service';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './core/custom-route-reuse-strategy/custom-route-reuse-strategy';
import { MonitoringService } from '@core/monitoring/services/monitoring.service';
import { MARKET_PROVIDER, MarketSiteByLocale } from '../configs/market.config';
import { siteUrlFactory, SITE_URL } from '@configs/site-url.config';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { InitializeAuthenticatedUserService } from '@core/initialize-authenticated-user/initialize-authenticated-user.service';
import { InitializeUnauthenticatedUserService } from '@core/initialize-unauthenticated-user/initialize-unauthenticated-user.service';
import { SessionService } from '@core/session/session.service';

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
    useFactory: initializerFactory,
    deps: [UserService, InitializeAuthenticatedUserService, InitializeUnauthenticatedUserService],
    multi: true,
  },
  {
    provide: APP_INITIALIZER,
    useFactory: initializeMonitoringFactory,
    deps: [MonitoringService],
    multi: true,
  },
  {
    provide: APP_INITIALIZER,
    useFactory: initializeSessionServiceFactory,
    deps: [SessionService],
    multi: true,
  },
  {
    provide: RouteReuseStrategy,
    useClass: CustomRouteReuseStrategy,
  },
];

export function initializerFactory(
  userService: UserService,
  initializeAuthenticatedUserService: InitializeAuthenticatedUserService,
  initializeUnauthenticatedUserService: InitializeUnauthenticatedUserService
): () => void {
  return () => (userService.isLogged ? initializeAuthenticatedUserService.initialize() : initializeUnauthenticatedUserService.initialize());
}

export function initializeMonitoringFactory(monitoringService: MonitoringService): () => void {
  return () => monitoringService.initialize();
}

export function initializeSessionServiceFactory(sessionService: SessionService): () => void {
  return () => sessionService.initSession();
}
