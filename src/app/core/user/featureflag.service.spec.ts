import { TestBed } from '@angular/core/testing';

import { FeatureFlagResponse, FeatureflagService } from './featureflag.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { HttpService } from '../http/http.service';
import { ResponseOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

describe('FeatureflagService', () => {

  let service: FeatureflagService;
  let http: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FeatureflagService,
        ...TEST_HTTP_PROVIDERS
      ]
    });
    service = TestBed.get(FeatureflagService);
    http = TestBed.get(HttpService);
  });

  describe('getFlag', () => {
    it('should call endpoint and return boolean', () => {
      const PERM = 'perm';
      let resp: boolean;
      const RESP: FeatureFlagResponse[] = [{
        name: PERM,
        active: true
      }];
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(RESP)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));

      service.getFlag(PERM).subscribe((r: boolean) => {
        resp = r;
      });

      expect(http.get).toHaveBeenCalledWith('api/v3/featureflag', {featureFlags: PERM});
      expect(resp).toBe(true);
    });
  });
});
