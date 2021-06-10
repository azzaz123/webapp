import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface MockUrl {
  url: string;
  data: any;
}

@Injectable()
export class MockInterceptor implements HttpInterceptor {
  public mockUrls?: MockUrl[] = [];

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    for (const mockUrl of this.mockUrls) {
      if (mockUrl.url === request.url) {
        return of(new HttpResponse({ status: 200, body: mockUrl.data }));
      }
    }

    return next.handle(request);
  }
}
