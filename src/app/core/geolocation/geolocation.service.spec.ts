import { TestBed, inject } from '@angular/core/testing';
import { TEST_HTTP_PROVIDERS, HttpService } from 'shield';
import { GeolocationService } from './geolocation.service';
import { GEOLOCATION_DATA_WEB } from "../../../tests/geolocation.fixtures";
import { Observable } from "rxjs/Observable";

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
    it('should call the http.get', () => {
      spyOn(http, 'get');
      service.search('Barcelona').subscribe(() => {
        expect(http.get).toHaveBeenCalled();
      })
    });
    it('should return the place info', () => {
      spyOn(http, 'get').and.returnValue(Observable.of(GEOLOCATION_DATA_WEB));
      service.search('Barcelona').subscribe((data) => {
        expect(data.length).toBe(1);
        expect(data.placeId).toBe('ChIJ5TCOcRaYpBIRCmZHTz37sEQ');
      })
    })
  });

  describe('geocode', () => {
    it('should call the http.get', () => {
      spyOn(http, 'get');
      service.geocode('ChIJ5TCOcRaYpBIRCmZHTz37sEQ').subscribe(() => {
        expect(http.get).toHaveBeenCalled();
      })
    });
    it('should return location coordinates', () => {
      spyOn(http, 'get').and.returnValue(Observable.of(GEOLOCATION_DATA_WEB));
      service.geocode('ChIJ5TCOcRaYpBIRCmZHTz37sEQ').subscribe((data) => {
        expect(data.length).toBe(1);
        expect(data.result.geometry.location).toBe({'lat': 41.38506389999999, 'lng': 2.1734035 });
      })
    })
  });
});
