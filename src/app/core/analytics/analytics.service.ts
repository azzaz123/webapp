import { Observable, ReplaySubject } from 'rxjs';
import mParticle from '@mparticle/web-sdk';
import { UserService } from './../user/user.service';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { User } from '../user/user';
import { AnalyticsEvent, AnalyticsPageView } from './analytics-constants';
import { filter } from 'rxjs/operators';
import { DeviceService } from '@core/device/device.service';

// TODO: This should not be exported. Anything that uses this should start using the getDeviceId method
export const DEVICE_ID_COOKIE_NAME = 'device_id';

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
    this.userService
      .me()
      .pipe(filter((user) => !!user))
      .subscribe((user: User) => {
        const CONFIG = {
          isDevelopmentMode: !environment.production,
          identifyRequest: { userIdentities: this.getUserIdentities(user) },
          identityCallback: (result) => {
            const mParticleUser = result.getUser();
            if (mParticleUser) {
              mParticleUser.setUserAttribute('deviceId', this.deviceService.getDeviceId());
            }
          },
        };
        mParticle.init(environment.mParticleKey, CONFIG);
        mParticle.ready(() => {
          this._mParticleReady$.next();
        });
      });
  }

  private getUserIdentities(user: User): { email?: string; customerid?: string } {
    if (!user.email || !user.id) {
      return {};
    }
    return {
      email: user.email,
      customerid: user.id,
    };
  }

  public trackEvent<T>(event: AnalyticsEvent<T>) {
    mParticle.logEvent(event.name, event.eventType, event.attributes);
  }

  public trackPageView<T>(page: AnalyticsPageView<T>) {
    mParticle.logPageView(page.name, page.attributes, page.flags);
  }
}
