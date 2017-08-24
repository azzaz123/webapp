import { TestBed } from '@angular/core/testing';
import { TEST_HTTP_PROVIDERS, HttpService } from 'shield';
import { GeolocationService } from './geolocation.service';
import { GEOLOCATION_DATA_WEB } from '../../../tests/geolocation.fixtures';
import { Observable } from 'rxjs/Observable';
import { ResponseOptions, Response } from '@angular/http';
import { GeolocationResponse } from './geolocation-response.interface';
import { AddressResponse } from './address-response.interface';
import { ADDRESS_DATA_WEB } from '../../../tests/address.fixtures';

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
    })
  });

  describe('geocode', () => {
    it('should return location coordinates', () => {
      let result: AddressResponse;
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(ADDRESS_DATA_WEB)});
      spyOn(http, 'getNoBase').and.returnValue(Observable.of(new Response(res)));
      service.geocode('ChIJ5TCOcRaYpBIRCmZHTz37sEQ').subscribe((data: AddressResponse) => {
        result = data;
      });
      expect(result).toEqual(ADDRESS_DATA_WEB);
    })
  });

});