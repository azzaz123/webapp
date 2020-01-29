import mParticle from '@mparticle/web-sdk';
import mixpanelKit from '@mparticle/web-mixpanel-kit';
import { UserService } from './../user/user.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../user/user';
import { AnalyticsEvent, AnalyticsPageView } from './analytics-constants';

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

      mixpanelKit.register(CONFIG);
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
