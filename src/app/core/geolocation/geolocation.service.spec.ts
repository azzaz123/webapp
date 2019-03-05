import { TestBed } from '@angular/core/testing';
import { GeolocationService } from './geolocation.service';
import { GEOLOCATION_DATA_WEB } from '../../../tests/geolocation.fixtures.spec';
import { Observable } from 'rxjs';
import { ResponseOptions, Response } from '@angular/http';
import { GeolocationResponse } from './geolocation-response.interface';
import { Coordinate } from './address-response.interface';
import { COORDINATE_DATA_WEB } from '../../../tests/address.fixtures.spec';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { HttpService } from '../http/http.service';

let service: GeolocationService;
let http: HttpService;

describe('GeolocationService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeolocationService, ...TEST_HTTP_PROVIDERS]
    });
    service = TestBed.get(GeolocationService);
    http = TestBed.get(HttpService);
  });

  describe('search', () => {
    it('should return the place info', () => {
      let result: GeolocationResponse[];
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(GEOLOCATION_DATA_WEB)});
      spyOn(http, 'getNoBase').and.returnValue(Observable.of(new Response(res)));
      service.search('Barcelona').subscribe((data: GeolocationResponse[]) => {
        result = data;
      });
      expect(result).toEqual(GEOLOCATION_DATA_WEB);
    });
  });

  describe('geocode', () => {
    it('should return location coordinates', () => {
      let result: Coordinate;
      const LOCATION_NAME = 'Barcelona';
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(COORDINATE_DATA_WEB)});
      spyOn(http, 'getNoBase').and.returnValue(Observable.of(new Response(res)));
      service.geocode(LOCATION_NAME).subscribe((data: Coordinate) => {
        result = data;
      });
      expect(result).toEqual({
        ...COORDINATE_DATA_WEB,
        name: LOCATION_NAME
      });
    });
  });

});
