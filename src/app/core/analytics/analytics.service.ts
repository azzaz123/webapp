import mParticle from '@mparticle/web-sdk';
import { UserService } from './../user/user.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../user/user';
import { EventInterface, PageViewInterface } from './analytics-constants';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private userService: UserService) { }

  public initialize() {
    this.userService.me().subscribe((user: User) => {
      const CONFIG = {
        isDevelopmentMode: !environment.production,
        identifyRequest: {
          userIdentities: {
            email: user.email,
            customerid: user.id
          }
        }
      };

      mParticle.init(environment.mParticleKey, CONFIG);
    });
  }

  public trackEvent<T>(event: EventInterface<T>) {
    mParticle.logEvent(event.name, event.eventType, event.attributes);
  }

  public trackPageView(page: PageViewInterface) {
    mParticle.logPageView(page.name, page.attributes, page.flags);
  }
}
