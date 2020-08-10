import mParticle from '@mparticle/web-sdk';
import appboyKit from '@mparticle/web-appboy-kit';
import { UserService } from './../user/user.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../user/user';
import * as Fingerprint2 from 'fingerprintjs2';
import {AnalyticsEvent, AnalyticsPageView, MParticleIntegrationIds} from './analytics-constants';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private userService: UserService) { }

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
      Fingerprint2.get({}, components => {
        const values = components.map(component => component.value);
        const fingerprint = Fingerprint2.x64hash128(values.join(''), 31);
        mParticle.setIntegrationAttribute(MParticleIntegrationIds.Internal, {
          deviceId: fingerprint
        });
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
