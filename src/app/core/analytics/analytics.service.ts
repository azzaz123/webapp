import mParticle from '@mparticle/web-sdk';
import appboyKit from '@mparticle/web-appboy-kit';
import { UserService } from './../user/user.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../user/user';
import { AnalyticsEvent, AnalyticsPageView } from './analytics-constants';
import { CookieService } from 'ngx-cookie';
import { UuidService } from '../uuid/uuid.service';

export const DEVICE_ID_COOKIE_NAME = 'device_id';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(
    private userService: UserService,
    private uuidService: UuidService,
    private cookieService: CookieService
  ) {}

  public initialize() {
    this.userService.me().subscribe((user: User) => {
      if (!user) {
        return;
      }

      const CONFIG = {
        isDevelopmentMode: !environment.production,
        identifyRequest: {
          userIdentities: {
            email: user.email,
            customerid: user.id,
          },
        },
        identityCallback: (result) => {
          let deviceId = this.cookieService.get(DEVICE_ID_COOKIE_NAME);
          if (!deviceId) {
            deviceId = this.uuidService.getUUID();
            this.cookieService.put(DEVICE_ID_COOKIE_NAME, deviceId, {
              expires: new Date('2038-01-19'),
            });
          }

          const user = result.getUser();
          if (user) {
            user.setUserAttribute('deviceId', deviceId);
          }
        },
      };

      appboyKit.register(CONFIG);
      mParticle.init(environment.mParticleKey, CONFIG);
    });
  }

  public trackEvent<T>(event: AnalyticsEvent<T>) {
    mParticle.logEvent(event.name, event.eventType, event.attributes);
  }

  public trackPageView<T>(page: AnalyticsPageView<T>) {
    mParticle.logPageView(page.name, page.attributes, page.flags);
  }
}
