import { TestBed, inject, fakeAsync } from '@angular/core/testing';

import { RealestateKeysService } from './realestate-keys.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { I18nService } from '../../core/i18n/i18n.service';
import { HttpService } from '../../core/http/http.service';
import { Key } from './key.interface';
import { ResponseOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { IOption } from 'ng-select';

describe('RealestateKeysService', () => {

  let service: RealestateKeysService;
  let http: HttpService;
  const RESPONSE = [{id: 'test', icon_id: 'test', text: 'test'}];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RealestateKeysService,
        I18nService,
        TEST_HTTP_PROVIDERS
      ]
    });
    service = TestBed.get(RealestateKeysService);
    http = TestBed.get(HttpService);
  });

  describe('getOperations', () => {
    let response: Key[];

    beforeEach(fakeAsync(() => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));

      service.getOperations().subscribe((r: Key[]) => {
        response = r;
      });
    }));

    it('should call endpoint', () => {
      expect(http.get).toHaveBeenCalledWith('api/v3/real_estate/keys/operation', {language: 'en', filter: false});
    });

    it('should return options', () => {
      expect(response).toEqual(RESPONSE);
    });
  });

  describe('getTypes', () => {
    let response: Key[];
    const OPERATION = 'operation';

    beforeEach(fakeAsync(() => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));

      service.getTypes(OPERATION).subscribe((r: Key[]) => {
        response = r;
      });
    }));

    it('should call endpoint', () => {
      expect(http.get).toHaveBeenCalledWith('api/v3/real_estate/keys/type', {language: 'en', operation: OPERATION});
    });

    it('should return options', () => {
      expect(response).toEqual(RESPONSE);
    });
  });

  describe('getConditions', () => {
    let response: IOption[];

    beforeEach(fakeAsync(() => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));

      service.getConditions().subscribe((r: IOption[]) => {
        response = r;
      });
    }));

    it('should call endpoint', () => {
      expect(http.get).toHaveBeenCalledWith('api/v3/real_estate/keys/condition', {language: 'en'});
    });

    it('should return options', () => {
      expect(response).toEqual([{
        value: 'test',
        label: 'test'
      }]);
    });
  });

  describe('getExtras', () => {
    let response: Key[];
    const TYPE = 'house';

    beforeEach(fakeAsync(() => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));

      service.getExtras(TYPE).subscribe((r: Key[]) => {
        response = r;
      });
    }));

    it('should call endpoint', () => {
      expect(http.get).toHaveBeenCalledWith('api/v3/real_estate/keys/extra', {language: 'en', type: TYPE});
    });

    it('should return options', () => {
      expect(response).toEqual(RESPONSE);
    });
  });
});
