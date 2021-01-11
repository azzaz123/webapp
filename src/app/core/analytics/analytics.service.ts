import { Observable, ReplaySubject } from 'rxjs';
import mParticle from '@mparticle/web-sdk';
import appboyKit from '@mparticle/web-appboy-kit';
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
  constructor(
    private userService: UserService,
    private deviceService: DeviceService
  ) {}

  private readonly _mParticleReady$: ReplaySubject<void> = new ReplaySubject<
    void
  >();

  public get mParticleReady$(): Observable<void> {
    return this._mParticleReady$.asObservable();
  }

  public initialize() {
    // TODO: Passing an empty object to identify an unknown user allows to set userAttributes
    //       This logic should be modified accordingly to prepare for the new public part of the webapp
    this.userService
      .me()
      .pipe(filter((user) => !!user))
      .subscribe((user: User) => {
        const CONFIG = {
          isDevelopmentMode: !environment.production,
          identifyRequest: {
            userIdentities: {
              email: user.email,
              customerid: user.id,
            },
          },
          identityCallback: (result) => {
            const mParticleUser = result.getUser();
            if (mParticleUser) {
              mParticleUser.setUserAttribute(
                'deviceId',
                this.deviceService.getDeviceId()
              );
            }
          },
        };

        appboyKit.register(CONFIG);
        mParticle.init(environment.mParticleKey, CONFIG);
        mParticle.ready(() => {
          this._mParticleReady$.next();
        });
      });
  }

  public trackEvent<T>(event: AnalyticsEvent<T>) {
    mParticle.logEvent(event.name, event.eventType, event.attributes);
  }

  public trackPageView<T>(page: AnalyticsPageView<T>) {
    mParticle.logPageView(page.name, page.attributes, page.flags);
  }
}
