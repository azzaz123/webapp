import { Observable, ReplaySubject } from 'rxjs';
import mParticle from '@mparticle/web-sdk';
import { UserService } from './../user/user.service';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { environment } from '@environments/environment';
import { User } from '../user/user';
import { AnalyticsEvent, AnalyticsPageView } from './analytics-constants';
import { DeviceService } from '@core/device/device.service';
import { Market, MARKET_PROVIDER } from '../../../configs/market.config';
import { APP_LOCALE } from '../../../configs/subdomains.config';
import { mParticleUser } from './resources/mParticle-interfaces';
import '@mparticle/web-google-analytics-kit';
import '@mparticle/web-optimizely-kit';

// TODO: This should not be exported. Anything that uses this should start using the getDeviceId method
export const DEVICE_ID_COOKIE_NAME = 'device_id';
export const DATA_PLAN_NAME = 'dataplan';
export const DATA_PLAN_VERSION = 5;
export const COMMON_MPARTICLE_CONFIG = {
  isDevelopmentMode: !environment.production,
  dataPlan: {
    planId: DATA_PLAN_NAME,
    planVersion: DATA_PLAN_VERSION,
  },
};

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly _mParticleReady$: ReplaySubject<void> = new ReplaySubject<void>();
  private mParticleuser: mParticleUser;
  constructor(
    private userService: UserService,
    private deviceService: DeviceService,
    @Inject(MARKET_PROVIDER) private _market: Market,
    @Inject(LOCALE_ID) private _localeId: APP_LOCALE
  ) {}

  public get mParticleReady$(): Observable<void> {
    return this._mParticleReady$.asObservable();
  }

  public setUserAttribute(key: string, value: string) {
    this.mParticleuser.setUserAttribute(key, value);
  }

  public initialize(): void {
    const loggedUser = this.userService.isLogged;

    if (loggedUser) {
      const user = this.userService.user;
      const userIdentities = this.getUserIdentities(user);
      const mParticleLoggedConfig = this.getMParticleConfig(userIdentities);

      this.initializeMParticleSDK(mParticleLoggedConfig);
    } else {
      const mParticleNotLoggedConfig = this.getMParticleConfig({});

      this.initializeMParticleSDK(mParticleNotLoggedConfig);
    }
  }

  public trackEvent<T>(event: AnalyticsEvent<T>) {
    mParticle.logEvent(event.name, event.eventType, event.attributes);
  }

  public trackPageView<T>(page: AnalyticsPageView<T>) {
    mParticle.logPageView(page.name, page.attributes, page.flags);
  }

  get market(): Market {
    return this._market;
  }

  get appLocale(): APP_LOCALE {
    return this._localeId;
  }

  private mParticleIdentityCallback(result) {
    const mParticleUser = result.getUser();

    if (mParticleUser) {
      this.mParticleuser = mParticleUser;
      mParticleUser.setUserAttribute('deviceId', this.deviceService.getDeviceId());
    }
  }

  private getUserIdentities(user: User): { email: string; customerid: string } {
    return {
      email: user.email,
      customerid: user.id,
    };
  }

  private initializeMParticleSDK(config: unknown): void {
    mParticle.init(environment.mParticleKey, config);
    mParticle.ready(() => {
      this._mParticleReady$.next();
    });
  }

  private getMParticleConfig(userIdentities: unknown) {
    const mParticleConfig = {
      ...COMMON_MPARTICLE_CONFIG,
      identifyRequest: {
        userIdentities,
      },
      identityCallback: (result) => this.mParticleIdentityCallback(result),
    };

    return mParticleConfig;
  }
}
