import { fakeAsync, TestBed } from '@angular/core/testing';

import { CarKeysService } from './car-keys.service';
import { HttpService, TEST_HTTP_PROVIDERS, I18nService } from 'shield';
import { ResponseOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { IOption } from 'ng-select';
import { CAR_BODY_TYPES, CAR_BODY_TYPES_RESPONSE } from '../../../../tests/car.fixtures';

describe('CarKeysService', () => {

  let service: CarKeysService;
  let http: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CarKeysService,
        TEST_HTTP_PROVIDERS,
        I18nService
      ]
    });
    service = TestBed.get(CarKeysService);
    http = TestBed.get(HttpService);
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  describe('getTypes', () => {
    let response: IOption[];
    beforeEach(fakeAsync(() => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(CAR_BODY_TYPES_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      service.getTypes().subscribe((r: IOption[]) => {
        response = r;
      });
    }));
    it('should call endpoint', () => {
      expect(http.get).toHaveBeenCalledWith('api/v3/cars/keys/bodytype', {language: 'en'});
    });
    it('should return options', () => {
      expect(response).toEqual(CAR_BODY_TYPES);
    });
  });

  describe('getTypeName', () => {
    let response: string;
    beforeEach(fakeAsync(() => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(CAR_BODY_TYPES_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      service.getTypeName('small_car').subscribe((r: string) => {
        response = r;
      });
    }));
    it('should call endpoint', () => {
      expect(http.get).toHaveBeenCalledWith('api/v3/cars/keys/bodytype', {language: 'en'});

    });
    it('should return the filtered text', () => {
      expect(response).toEqual('Small');
    });
  });
});
