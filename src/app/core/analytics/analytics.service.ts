import { Observable, ReplaySubject } from 'rxjs';
import mParticle from '@mparticle/web-sdk';
import { UserService } from './../user/user.service';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { User } from '../user/user';
import { AnalyticsEvent, AnalyticsPageView } from './analytics-constants';
import { DeviceService } from '@core/device/device.service';

// TODO: This should not be exported. Anything that uses this should start using the getDeviceId method
export const DEVICE_ID_COOKIE_NAME = 'device_id';
export const COMMON_MPARTICLE_CONFIG = {
  isDevelopmentMode: !environment.production,
  dataPlan: {
    planId: 'dataplan',
    planVersion: 1,
  },
};

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(private userService: UserService, private deviceService: DeviceService) {}

  private readonly _mParticleReady$: ReplaySubject<void> = new ReplaySubject<void>();

  public get mParticleReady$(): Observable<void> {
    return this._mParticleReady$.asObservable();
  }

  public initialize(): void {
    const loggedUser = this.userService.isLogged;

    if (loggedUser) {
      const user = this.userService.user;
      const mParticleLoggedConfig = {
        ...COMMON_MPARTICLE_CONFIG,
        identifyRequest: {
          userIdentities: this.getUserIdentities(user),
        },
        identityCallback: (result) => this.mParticleIdentityCallback(result),
      };

      this.initializeMParticleSDK(mParticleLoggedConfig);
    } else {
      const mParticleNotLoggedConfig = {
        ...COMMON_MPARTICLE_CONFIG,
        identifyRequest: {
          userIdentities: {},
        },
        identityCallback: (result) => this.mParticleIdentityCallback(result),
      };

      this.initializeMParticleSDK(mParticleNotLoggedConfig);
    }
  }

  private mParticleIdentityCallback(result) {
    const mParticleUser = result.getUser();

    if (mParticleUser) {
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

  public trackEvent<T>(event: AnalyticsEvent<T>) {
    mParticle.logEvent(event.name, event.eventType, event.attributes);
  }

  public trackPageView<T>(page: AnalyticsPageView<T>) {
    mParticle.logPageView(page.name, page.attributes, page.flags);
  }
}
