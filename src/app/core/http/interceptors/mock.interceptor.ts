import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MOCK_SUBSCRIPTION_SLOTS_RESPONSE } from '../../../../tests/subscriptions.fixtures.spec';
import { SUBSCRIPTIONS_SLOTS_ENDPOINT } from '../../subscriptions/subscriptions.service';
import { environment } from '../../../../environments/environment';
import { FeatureflagService } from '../../user/featureflag.service';

export interface MockUrl {
  url: string;
  data: any;
}

@Injectable()
export class MockInterceptor implements HttpInterceptor {

  public mockUrls: MockUrl[] = [];

  constructor(private featureFlagService: FeatureflagService) {

    this.featureFlagService.getFlag('web_subscriptions').subscribe(active => {
      if (active) {
        const mockSubscriptionSlots = {
          url: environment.baseUrl + SUBSCRIPTIONS_SLOTS_ENDPOINT,
          data: MOCK_SUBSCRIPTION_SLOTS_RESPONSE
        };
        this.mockUrls.push(mockSubscriptionSlots);
      }
    });

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    for (const mockUrl of this.mockUrls) {
      if (mockUrl.url === request.url) {
        return of(new HttpResponse({ status: 200, body: mockUrl.data }));
      }
    }

    return next.handle(request);
  }
}
