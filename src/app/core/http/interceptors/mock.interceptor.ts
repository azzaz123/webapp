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
import { getMockedItemProResponses } from '../../../../tests/item.fixtures.spec';
import { MINES_BY_CATEGORY_ENDPOINT } from '../../item/item.service';

export interface MockUrl {
  url: string;
  data: any;
}

export const MOCK_SUBSCRIPTION_SLOTS_URL_RESPONSE: MockUrl = {
  url: environment.baseUrl + SUBSCRIPTIONS_SLOTS_ENDPOINT,
  data: MOCK_SUBSCRIPTION_SLOTS_RESPONSE
};

export const MOCK_MINES_BY_CATEGORY_URL_RESPONES: MockUrl = {
  url: environment.baseUrl + MINES_BY_CATEGORY_ENDPOINT,
  data: []
};

@Injectable()
export class MockInterceptor implements HttpInterceptor {

  public mockUrls: MockUrl[] = [];

  constructor(private featureFlagService: FeatureflagService) {

    this.featureFlagService.getFlag('web_subscriptions').subscribe(active => {
      if (!active) {
        return;
      }
      this.mockUrls.push(MOCK_SUBSCRIPTION_SLOTS_URL_RESPONSE);
      this.mockUrls.push(MOCK_MINES_BY_CATEGORY_URL_RESPONES);
    });

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    for (const mockUrl of this.mockUrls) {
      if (mockUrl.url === request.url) {
        if (request.url === MOCK_MINES_BY_CATEGORY_URL_RESPONES.url) {
          const init = request.params.get('init');
          const categoryId = request.params.get('categoryId');
          const status = request.params.get('status');
          const body = getMockedItemProResponses(init, categoryId, status);
          return of(new HttpResponse({ status: 200, body }));
        } else {
          return of(new HttpResponse({ status: 200, body: mockUrl.data }));
        }
      }
    }

    return next.handle(request);
  }
}
