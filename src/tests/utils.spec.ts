import { BaseRequestOptions, ConnectionBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { HttpService } from '../app/core/http/http.service';
import { AccessTokenService } from '../app/core/http/access-token.service';
import { EventService } from '../app/core/event/event.service';

export const TEST_HTTP_PROVIDERS: any[] = [{
  provide: HttpService, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions, accesTokenService: AccessTokenService, eventService: EventService) => {
    return new HttpService(backend, defaultOptions, accesTokenService, eventService);
  }, deps: [MockBackend, BaseRequestOptions, AccessTokenService, EventService]},
  {
    provide: AccessTokenService, useValue: {
    accessToken: null,
    storeAccessToken(value) {
      this.accessToken = value;
    },
    deleteAccessToken() {
      this.accessToken = null;
    }
  }
  },
  MockBackend,
  BaseRequestOptions,
  EventService
];
