import { Observable, ReplaySubject } from 'rxjs';
import { mParticle, appboyKit } from './mparticle.constants';
import { IdentityResult, MPConfiguration, UserIdentities, User as MPUser } from '@mparticle/web-sdk';
import { UserService } from './../user/user.service';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { environment } from '@environments/environment';
import { User } from '../user/user';
import { AnalyticsEvent, AnalyticsPageView } from './analytics-constants';
import { DeviceService } from '@core/device/device.service';
import { Market, MARKET_PROVIDER } from '@configs/market.config';
import { APP_LOCALE } from '@configs/subdomains.config';

// FIXME: This kits probably need to be registered
import '@mparticle/web-google-analytics-kit';

// TODO: This should not be exported. Anything that uses this should start using the getDeviceId method
export const DEVICE_ID_COOKIE_NAME = 'device_id';
export const DATA_PLAN_NAME = 'dataplan';
export const DATA_PLAN_VERSION = 6;
export const COMMON_MPARTICLE_CONFIG = {
  isDevelopmentMode: !environment.production,
  dataPlan: {
    planId: DATA_PLAN_NAME,
    planVersion: DATA_PLAN_VERSION,
  },
};

// FIXME: In this file we have added several any to avoid a full refactor on mParticle type definition
//        We will need to take a look into that sooner or later

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly _mParticleReady$: ReplaySubject<void> = new ReplaySubject<void>();
  constructor(
    private deviceService: DeviceService,
    @Inject(MARKET_PROVIDER) private _market: Market,
    @Inject(LOCALE_ID) private _localeId: APP_LOCALE
  ) {}

  public get mParticleReady$(): Observable<void> {
    return this._mParticleReady$.asObservable();
  }

  public get market(): Market {
    return this._market;
  }

  public get appLocale(): APP_LOCALE {
    return this._localeId;
  }

  public setUserAttribute(key: string, value: string) {
    this.getMPUser()?.setUserAttribute(key, value);
  }

  public initializeAnalyticsWithAuthenticatedUser(user: User): Promise<void> {
    const userIdentities = this.getUserIdentities(user);
    const mParticleLoggedConfig = this.getMParticleConfig(userIdentities);

    return import('@mtempranowalla/web-optimizely-kit').then((_optimizelyKit) => {
      _optimizelyKit.register(mParticleLoggedConfig);
      return this.initializeMParticleSDK(mParticleLoggedConfig);
    });
  }

  public initializeAnalyticsWithUnauthenticatedUser(): Promise<void> {
    const mParticleNotLoggedConfig = this.getMParticleConfig({});

    return this.initializeMParticleSDK(mParticleNotLoggedConfig);
  }

  public trackEvent<T>(event: AnalyticsEvent<T>): void {
    mParticle.logEvent(event.name, event.eventType as any, event.attributes as any);
  }

  public trackPageView<T>(page: AnalyticsPageView<T>): void {
    mParticle.logPageView(page.name, page.attributes as any, page.flags as any);
  }

  public loginUser(userIdentities: UserIdentities, callback?: () => void): void {
    mParticle.Identity.login({ userIdentities }, callback);
  }

  private getMPUser(): MPUser | undefined {
    return mParticle.Identity.getCurrentUser();
  }

  private mParticleIdentityCallback(result: IdentityResult): void {
    const mParticleUser = result.getUser();

    if (mParticleUser) {
      mParticleUser.setUserAttribute('deviceId', this.deviceService.getDeviceId());
      mParticleUser.setUserAttribute('webDeviceType', this.deviceService.getDeviceType());
    }
  }

  private getUserIdentities(user: User): UserIdentities {
    return {
      email: user.email,
      customerid: user.id,
    };
  }

  private initializeMParticleSDK(config: MPConfiguration): Promise<void> {
    appboyKit.register(config);

    return new Promise((resolve) => {
      mParticle.init(environment.mParticleKey, config);
      mParticle.ready(() => {
        this._mParticleReady$.next();
        resolve();
      });
    });
  }

  private getMParticleConfig(userIdentities: UserIdentities): MPConfiguration {
    return {
      ...COMMON_MPARTICLE_CONFIG,
      identifyRequest: {
        userIdentities,
      },
      identityCallback: this.mParticleIdentityCallback.bind(this),
    };
  }
}
