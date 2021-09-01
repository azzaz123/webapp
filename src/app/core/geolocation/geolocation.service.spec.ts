import { TestBed } from '@angular/core/testing';
import { GeolocationService, MAPS_PLACES_API, MAPS_PROVIDER, MAPS_PLACE_API, MAPS_REVERSE_GEOCODE } from './geolocation.service';
import { ItemPlace } from './geolocation-response.interface';
import { HttpClientTestingModule, TestRequest, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { Coordinate } from './address-response.interface';
import { COORDINATE_DATA_WEB } from '../../../tests/address.fixtures.spec';
import { MOCK_LOCATION_SUGGESTIONS } from '@fixtures/core/geolocation/geolocation-service.fixtures.spec';
import { SITE_URL } from '@configs/site-url.config';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';

let service: GeolocationService;
let httpMock: HttpTestingController;

const MOCK_CITY = 'Barcelona';
const MOCK_PLACE_ID = '131';

describe('GeolocationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GeolocationService,
        {
          provide: SITE_URL,
          useValue: MOCK_SITE_URL,
        },
      ],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(GeolocationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('search', () => {
    it('should return place info', () => {
      const expectedUrlParams = `query=${MOCK_CITY}&provider=${MAPS_PROVIDER}`;
      const expectedUrl = `${MOCK_SITE_URL}${MAPS_PLACES_API}?${expectedUrlParams}`;
      let response: ItemPlace[];

      service.search(MOCK_CITY).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_LOCATION_SUGGESTIONS);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response).toEqual(MOCK_LOCATION_SUGGESTIONS);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('geocode', () => {
    it('should return location coordinates', () => {
      const expectedUrlParams = `placeId=${MOCK_PLACE_ID}`;
      const expectedUrl = `${MOCK_SITE_URL}${MAPS_PLACE_API}?${expectedUrlParams}`;
      let response: Coordinate;

      service.geocode(MOCK_PLACE_ID).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(COORDINATE_DATA_WEB);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response).toEqual({ ...COORDINATE_DATA_WEB, name: MOCK_PLACE_ID });
      expect(req.request.method).toBe('GET');
    });
  });

  describe('reverseGeocode', () => {
    it('should return location label', () => {
      const responseBody = { label: 'Madrid, 0000, España' };
      const expectedUrlParams = `latitude=0&longitude=0`;
      const expectedUrl = `${MOCK_SITE_URL}${MAPS_REVERSE_GEOCODE}?${expectedUrlParams}`;
      let response: string;

      service.reverseGeocode('0', '0').subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(responseBody);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response).toEqual(responseBody.label);
      expect(req.request.method).toBe('GET');
    });
  });
});
