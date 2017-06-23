import { TestBed } from '@angular/core/testing';

import { AccessTokenService } from './access-token.service';
import { CookieService } from 'ngx-cookie';

describe('AccessTokenService', () => {

  let service: AccessTokenService;
  let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AccessTokenService,
        {
          provide: CookieService, useValue: {
          value: null,
          put(value) {
            this.value = value;
          },
          remove() {
            this.value = null;
          },
          get() {
            return this.value;
          }
        }
        }
      ]
    });
    service = TestBed.get(AccessTokenService);
    cookieService = TestBed.get(CookieService);
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  describe('storeAccessToken', () => {
    it('should call setItem and store token', () => {
      spyOn(cookieService, 'put');
      service.storeAccessToken('abc');
      expect(cookieService.put).toHaveBeenCalledWith('accessToken', 'abc');
      expect(service['_accessToken']).toEqual('abc');
    });
  });

  describe('deleteAccessToken', () => {
    it('should delete token and call removeItem', () => {
      service['_accessToken'] = 'abc';
      spyOn(cookieService, 'remove');
      service.deleteAccessToken();
      expect(cookieService.remove).toHaveBeenCalledWith('accessToken');
      expect(service['_accessToken']).toBeNull();
    });
  });

  describe('get accessToken', () => {
    it('should get token from local storage if not set and set it', () => {
      spyOn(cookieService, 'get').and.returnValue('abc');
      expect(service.accessToken).toBe('abc');
      expect(cookieService.get).toHaveBeenCalledWith('accessToken');
      expect(service['_accessToken']).toEqual('abc');
    });
    it('should not call getItem if token is set', () => {
      spyOn(cookieService, 'get');
      service['_accessToken'] = 'abc';
      expect(service.accessToken).toBe('abc');
      expect(cookieService.get).not.toHaveBeenCalled();
    });
  });
});
