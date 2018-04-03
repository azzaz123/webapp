import { fakeAsync, TestBed } from '@angular/core/testing';

import { CarSuggestionsService } from './car-suggestions.service';
import { IOption } from 'ng-select';
import { ResponseOptions, Response } from '@angular/http';
import {
  CAR_BRANDS, CAR_BRANDS_RESPONSE, CAR_MODELS, CAR_MODELS_RESPONSE, CAR_VERSIONS, CAR_VERSIONS_RESPONSE, CAR_YEARS,
  CAR_YEARS_RESPONSE
} from '../../../../tests/car.fixtures.spec';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../../../core/http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../../../tests/utils.spec';

describe('CarSuggestionsService', () => {

  let service: CarSuggestionsService;
  let http: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CarSuggestionsService,
        TEST_HTTP_PROVIDERS
      ]
    });
    service = TestBed.get(CarSuggestionsService);
    http = TestBed.get(HttpService);
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  describe('getBrands', () => {
    let response: IOption[];
    beforeEach(fakeAsync(() => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(CAR_BRANDS_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      service.getBrands().subscribe((r: IOption[]) => {
        response = r;
      });
    }));
    it('should call endpoint', () => {
      expect(http.get).toHaveBeenCalledWith('api/v3/suggesters/cars/brands');
    });
    it('should return options', () => {
      expect(response).toEqual(CAR_BRANDS);
    });
  });

  describe('getModels', () => {
    let response: IOption[];
    beforeEach(fakeAsync(() => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(CAR_MODELS_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      service.getModels('Abarth').subscribe((r: IOption[]) => {
        response = r;
      });
    }));
    it('should call endpoint', () => {
      expect(http.get).toHaveBeenCalledWith('api/v3/suggesters/cars/models', {brand: 'Abarth'});
    });
    it('should return options', () => {
      expect(response).toEqual(CAR_MODELS);
    });
  });

  describe('getYears', () => {
    let response: IOption[];
    beforeEach(fakeAsync(() => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(CAR_YEARS_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      service.getYears('Abarth', 'Spider').subscribe((r: IOption[]) => {
        response = r;
      });
    }));
    it('should call endpoint', () => {
      expect(http.get).toHaveBeenCalledWith('api/v3/suggesters/cars/years', {brand: 'Abarth', model: 'Spider'});
    });
    it('should return options', () => {
      expect(response).toEqual(CAR_YEARS);
    });
  });

  describe('getVersions', () => {
    let response: IOption[];
    beforeEach(fakeAsync(() => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(CAR_VERSIONS_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      service.getVersions('Abarth', 'Spider', '2017').subscribe((r: IOption[]) => {
        response = r;
      });
    }));
    it('should call endpoint', () => {
      expect(http.get).toHaveBeenCalledWith('api/v3/suggesters/cars/versions', {
        brand: 'Abarth',
        model: 'Spider',
        year: '2017'
      });
    });
    it('should return options', () => {
      expect(response).toEqual(CAR_VERSIONS);
    });
  });

});
