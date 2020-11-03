import { TestBed } from '@angular/core/testing';

import { CarSuggestionsService, CARS_SUGGESTER_API_URL } from './car-suggestions.service';
import { IOption } from 'app/dropdown/utils/option.interface';
import {
  CAR_BRANDS, CAR_BRANDS_RESPONSE, CAR_MODELS, CAR_MODELS_RESPONSE, CAR_VERSIONS, CAR_VERSIONS_RESPONSE, CAR_YEARS,
  CAR_YEARS_RESPONSE
} from '../../../tests/car.fixtures.spec';
import { environment } from '../../../environments/environment';
import { TestRequest, HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

let service: CarSuggestionsService;
let httpMock: HttpTestingController;
const MOCK_BRAND = 'Audi';
const MOCK_MODEL = 'A5';
const MOCK_YEAR = '2016';

describe('CarSuggestionsService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CarSuggestionsService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CarSuggestionsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getBrands', () => {
    it('should call endpoint and return brands', () => {
      const expectedUrl = `${environment.baseUrl}${CARS_SUGGESTER_API_URL}/brands`;
      let response: IOption[];

      service.getBrands().subscribe(r => response = r);
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(CAR_BRANDS_RESPONSE);

      expect(req.request.url).toEqual(expectedUrl);
      expect(response).toEqual(CAR_BRANDS);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('getModels', () => {
    it('should call endpoint and return models', () => {
      const expectedUrlParams = `brand=${MOCK_BRAND}`;
      const expectedUrl = `${environment.baseUrl}${CARS_SUGGESTER_API_URL}/models?${expectedUrlParams}`;
      let response: IOption[];

      service.getModels(MOCK_BRAND).subscribe(r => response = r);
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(CAR_MODELS_RESPONSE);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response).toEqual(CAR_MODELS);
      expect(req.request.method).toBe('GET');
    });
  });

  describe(('getYears'), () => {
    it('should call endpoint and return years', () => {
      const expectedUrlParams = `brand=${MOCK_BRAND}&model=${MOCK_MODEL}`;
      const expectedUrl = `${environment.baseUrl}${CARS_SUGGESTER_API_URL}/years?${expectedUrlParams}`;
      let response: IOption[];

      service.getYears(MOCK_BRAND, MOCK_MODEL).subscribe(r => response = r);
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(CAR_YEARS_RESPONSE);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response).toEqual(CAR_YEARS);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('getVersions', () => {
    it('should call endpoint and return versions', () => {
      const expectedUrlParams = `brand=${MOCK_BRAND}&model=${MOCK_MODEL}&year=${MOCK_YEAR}`;
      const expectedUrl = `${environment.baseUrl}${CARS_SUGGESTER_API_URL}/versions?${expectedUrlParams}`;
      let response: IOption[];

      service.getVersions(MOCK_BRAND, MOCK_MODEL, MOCK_YEAR).subscribe(r => response = r);
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(CAR_VERSIONS_RESPONSE);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response).toEqual(CAR_VERSIONS);
      expect(req.request.method).toBe('GET');
    });
  });
});
