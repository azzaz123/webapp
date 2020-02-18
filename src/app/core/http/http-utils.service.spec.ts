import { TestBed } from '@angular/core/testing';

import { HttpUtilsService } from './http-utils.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RequestOptions } from '@angular/http';
import { AccessTokenService } from './access-token.service';

describe('HttpUtilsService', () => {

  let accessTokenService: AccessTokenService;
  let httpUtilsService: HttpUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
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
        }
      ]
    });

    accessTokenService = TestBed.get(AccessTokenService);
    httpUtilsService = TestBed.get(HttpUtilsService);
    accessTokenService.storeAccessToken(null);
  });

  it('should be created', () => {
    expect(httpUtilsService).toBeTruthy();
  });

  describe('getOptions', () => {
    let options: RequestOptions;
    const URL = '/api/v3/test';
    const METHOD = 'GET';
    const TIME = 123456;
    describe('addSignature true', () => {
      beforeEach(() => {
        accessTokenService.storeAccessToken('token');
        spyOn<any>(window, 'Date').and.returnValue({
          getTime: () => {
            return TIME;
          }
        });
        options = httpUtilsService['getOptions'](null, URL, METHOD);
      });
      it('should append Timestamp', () => {
        expect(options.headers.get('Timestamp')).toBe(TIME.toString());
      });
      it('should append X-Signature', () => {
        expect(options.headers.has('X-Signature')).toBeTruthy();
      });
    });
  });
});
