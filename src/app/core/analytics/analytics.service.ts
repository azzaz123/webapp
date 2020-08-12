import mParticle from '@mparticle/web-sdk';
import appboyKit from '@mparticle/web-appboy-kit';
import { UserService } from './../user/user.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../user/user';
import { AnalyticsEvent, AnalyticsPageView, MParticleIntegrationIds } from './analytics-constants';
import { CookieService } from "ngx-cookie";
import { UUID } from "angular2-uuid";

export const DEVICE_ID_COOKIE_NAME = 'device_id';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private userService: UserService, private cookieService: CookieService) { }

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
            customerid: user.id
          }
        }
      };

      appboyKit.register(CONFIG);
      mParticle.init(environment.mParticleKey, CONFIG);

      let deviceId = this.cookieService.get(DEVICE_ID_COOKIE_NAME);
      if (!deviceId) {
        deviceId = UUID.UUID();
        this.cookieService.put(DEVICE_ID_COOKIE_NAME, deviceId, {
          expires: new Date('2038-01-19')
        });
      }
      mParticle.setIntegrationAttribute(MParticleIntegrationIds.Internal, {
        deviceId: deviceId
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
