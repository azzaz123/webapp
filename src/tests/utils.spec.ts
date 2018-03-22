import { BaseRequestOptions, ConnectionBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { HttpService } from '../app/core/http/http.service';
import { AccessTokenService } from '../app/core/http/access-token.service';

export const TEST_HTTP_PROVIDERS: any[] = [{
  provide: HttpService, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions, accesTokenService: AccessTokenService) => {
    return new HttpService(backend, defaultOptions, accesTokenService);
  }, deps: [MockBackend, BaseRequestOptions, AccessTokenService]},
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
  BaseRequestOptions
];
