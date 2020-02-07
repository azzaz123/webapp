import { TestBed } from '@angular/core/testing';
import { GeolocationService, MAPS_PLACES_API, MAPS_PROVIDER, MAPS_PLACE_API } from './geolocation.service';
import { GEOLOCATION_DATA_WEB } from '../../../tests/geolocation.fixtures.spec';
import { GeolocationResponse } from './geolocation-response.interface';
import { HttpClientTestingModule, TestRequest, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { Coordinate } from './address-response.interface';
import { COORDINATE_DATA_WEB } from '../../../tests/address.fixtures.spec';

let service: GeolocationService;
let httpMock: HttpTestingController;

const MOCK_CITY = 'Barcelona';
const MOCK_PLACE_ID = '131';

describe('GeolocationService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeolocationService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.get(GeolocationService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('search', () => {
    it('should return place info', () => {
      const expectedUrlParams = `query=${MOCK_CITY}&provider=${MAPS_PROVIDER}`;
      const expectedUrl = `${environment.siteUrl}${MAPS_PLACES_API}?${expectedUrlParams}`;
      let response: GeolocationResponse[];

      service.search(MOCK_CITY).subscribe(r => response = r);
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(GEOLOCATION_DATA_WEB);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response).toEqual(GEOLOCATION_DATA_WEB);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('geocode', () => {
    it('should return location coordinates', () => {
      const expectedUrlParams = `placeId=${MOCK_PLACE_ID}`;
      const expectedUrl = `${environment.siteUrl}${MAPS_PLACE_API}?${expectedUrlParams}`;
      let response: Coordinate;

      service.geocode(MOCK_PLACE_ID).subscribe(r => response = r);
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(COORDINATE_DATA_WEB);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response).toEqual({ ...COORDINATE_DATA_WEB, name: MOCK_PLACE_ID });
      expect(req.request.method).toBe('GET');
    });
  });

});
