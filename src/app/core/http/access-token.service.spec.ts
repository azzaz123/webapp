import { TestBed } from '@angular/core/testing';

import { AccessTokenService } from './access-token.service';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../../environments/environment';

describe('AccessTokenService', () => {
  const aToken = 'abc';
  const cookieName = 'accessToken';
  let service: AccessTokenService;
  let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AccessTokenService,
        {
          provide: CookieService, useValue: {
          put(value) {
          },
          remove() {
          },
          get () {
          }
        }
        }
      ]
    });
    service = TestBed.get(AccessTokenService);
    cookieService = TestBed.get(CookieService);
  });

  describe('storeAccessToken', () => {
    it('should call setItem and store token with suffix if is not production', () => {
      environment.production = false;
      environment.cookieSuffix = 'Beta';
      spyOn(cookieService, 'put');

      service.storeAccessToken(aToken);

      expect(cookieService.put).toHaveBeenCalledWith(cookieName + environment.cookieSuffix, aToken, { domain: '.wallapop.com' });
      expect(service['_accessToken']).toEqual(aToken);
    });

    it('should call setItem and store token without suffix if is production', () => {
      environment.production = true;
      spyOn(cookieService, 'put');

      service.storeAccessToken(aToken);

      expect(cookieService.put).toHaveBeenCalledWith(cookieName, aToken, { domain: '.wallapop.com' });
      expect(service['_accessToken']).toEqual(aToken);
    });
  });

  describe('deleteAccessToken should remove cookie and delete token', () => {
    it('with suffix if is not production', () => {
      service['_accessToken'] = aToken;
      environment.production = false;
      environment.cookieSuffix = 'Beta';
      spyOn(cookieService, 'remove');

      service.deleteAccessToken();

      expect(cookieService.remove['calls'].argsFor(0)[0]).toBe(cookieName + environment.cookieSuffix);
      expect(service['_accessToken']).toBeNull();
    });

    it('without suffix if is production', () => {
      service['_accessToken'] = aToken;
      environment.production = true;
      spyOn(cookieService, 'remove');

      service.deleteAccessToken();

      expect(cookieService.remove['calls'].argsFor(0)[0]).toBe(cookieName);
      expect(service['_accessToken']).toBeNull();
    });
  });

  describe('get accessToken should get token', () => {
    it('with suffix if is not production and cache it', () => {
      environment.production = false;
      environment.cookieSuffix = 'Beta';
      spyOn(cookieService, 'get').and.returnValue(aToken);

      const token = service.accessToken;

      expect(token).toBe(aToken);
      expect(cookieService.get).toHaveBeenCalledWith(cookieName + environment.cookieSuffix);
    });

    it('without suffix if is production and cache it', () => {
      environment.production = true;
      spyOn(cookieService, 'get').and.returnValue(aToken);

      const token = service.accessToken;

      expect(token).toBe(aToken);
      expect(cookieService.get).toHaveBeenCalledWith(cookieName);
    });

    it('from cache if has been called before', () => {
      spyOn(cookieService, 'get');
      service['_accessToken'] = aToken;

      const token = service.accessToken;

      expect(token).toBe(aToken);
      expect(cookieService.get).not.toHaveBeenCalled();
    });
  });
});
