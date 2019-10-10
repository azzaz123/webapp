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

export interface MockUrl {
  url: string;
  data: any;
}

export const MOCK_SUBSCRIPTION_SLOTS_URL_RESPONSE: MockUrl = {
  url: environment.baseUrl + SUBSCRIPTIONS_SLOTS_ENDPOINT,
  data: MOCK_SUBSCRIPTION_SLOTS_RESPONSE
};

@Injectable()
export class MockInterceptor implements HttpInterceptor {

  public mockUrls: MockUrl[] = [MOCK_SUBSCRIPTION_SLOTS_URL_RESPONSE];

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    for (const mockUrl of this.mockUrls) {
      if (mockUrl.url === request.url) {
        return of(new HttpResponse({ status: 200, body: mockUrl.data }));
      }
    }

    return next.handle(request);
  }
}
