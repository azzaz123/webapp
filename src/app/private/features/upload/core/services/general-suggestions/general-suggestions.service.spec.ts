import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { I18nService } from '@core/i18n/i18n.service';
import { environment } from '@environments/environment';
import {
  MOCK_BRAND,
  MOCK_BRANDS_RESPONSE,
  MOCK_BRAND_MODEL_RESPONSE,
  MOCK_CONDITIONS,
  MOCK_CONDITIONS_RESPONSE,
  MOCK_GENDER,
  MOCK_MODEL,
  MOCK_MODELS_RESPONSE,
  MOCK_OBJECT_TYPES,
  MOCK_OBJECT_TYPE_ID,
  MOCK_SIZES,
  MOCK_SIZES_RESPONSE,
} from '@fixtures/extra-info.fixtures.spec';
import { ACCEPT_HEADERS } from '@public/core/constants/header-constants';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { Brand, BrandModel, Model, ObjectType } from '../../models/brand-model.interface';
import { CONDITION_KEYS_API_URL, FASHION_KEYS_API_URL, GeneralSuggestionsService, SUGGESTERS_API_URL } from './general-suggestions.service';

describe('GeneralSuggestionsService', () => {
  let service: GeneralSuggestionsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeneralSuggestionsService, { provide: LOCALE_ID, useValue: 'en' }],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(GeneralSuggestionsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getObjectTypes', () => {
    it('should call the object-type endpoint and return object types', () => {
      const expectedUrlParams = `category_id=${CATEGORY_IDS.CELL_PHONES_ACCESSORIES}`;
      const expectedUrl = `${environment.baseUrl}${SUGGESTERS_API_URL}/object-type?${expectedUrlParams}`;
      let response: ObjectType[];

      service.getObjectTypes(CATEGORY_IDS.CELL_PHONES_ACCESSORIES).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_OBJECT_TYPES);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response).toEqual(MOCK_OBJECT_TYPES);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Accept')).toBe(ACCEPT_HEADERS.SUGGESTERS_V3);
      expect(req.request.headers.get('Accept-Language')).toBe('en');
    });
  });

  describe('getBrandsAndModels', () => {
    it('should call the brand-model endpoint and return brand&model results', () => {
      const expectedUrlParams = `text=${MOCK_BRAND}&category_id=${CATEGORY_IDS.CELL_PHONES_ACCESSORIES}&object_type_id=${MOCK_OBJECT_TYPE_ID}`;
      const expectedUrl = `${environment.baseUrl}${SUGGESTERS_API_URL}/brand-model?${expectedUrlParams}`;
      let response: BrandModel[];

      service.getBrandsAndModels(MOCK_BRAND, CATEGORY_IDS.CELL_PHONES_ACCESSORIES, MOCK_OBJECT_TYPE_ID).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_BRAND_MODEL_RESPONSE);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response).toEqual(MOCK_BRAND_MODEL_RESPONSE);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('getModels', () => {
    it('should call the model endpoint and return models', () => {
      const expectedUrlParams = `text=${MOCK_MODEL}&category_id=${CATEGORY_IDS.CELL_PHONES_ACCESSORIES}&brand=${MOCK_BRAND}&object_type_id=${MOCK_OBJECT_TYPE_ID}`;
      const expectedUrl = `${environment.baseUrl}${SUGGESTERS_API_URL}/model?${expectedUrlParams}`;
      let response: Model[];

      service.getModels(MOCK_MODEL, CATEGORY_IDS.CELL_PHONES_ACCESSORIES, MOCK_BRAND, MOCK_OBJECT_TYPE_ID).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_MODELS_RESPONSE);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response).toEqual(MOCK_MODELS_RESPONSE);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('getBrands', () => {
    it('should call the brand endpoint and return brands', () => {
      const expectedUrlParams = `text=${MOCK_MODEL}&category_id=${CATEGORY_IDS.CELL_PHONES_ACCESSORIES}&object_type_id=${MOCK_OBJECT_TYPE_ID}`;
      const expectedUrl = `${environment.baseUrl}${SUGGESTERS_API_URL}/brand?${expectedUrlParams}`;
      let response: Brand[];

      service.getBrands(MOCK_MODEL, CATEGORY_IDS.CELL_PHONES_ACCESSORIES, MOCK_OBJECT_TYPE_ID).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_BRANDS_RESPONSE);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response).toEqual(MOCK_BRANDS_RESPONSE);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('getSizes', () => {
    it('should call the size endpoint and return sizes', () => {
      const expectedUrlParams = `object_type_id=${MOCK_OBJECT_TYPE_ID}&language=en`;
      const expectedUrl = `${environment.baseUrl}${FASHION_KEYS_API_URL}/size?${expectedUrlParams}`;
      let response: IOption[];

      service.getSizes(MOCK_OBJECT_TYPE_ID, MOCK_GENDER).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_SIZES);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response).toEqual(MOCK_SIZES_RESPONSE);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('getConditions', () => {
    it('should return the conditions for the selected category', () => {
      const expectedUrlParams = `language=en`;
      const expectedUrl = `${environment.baseUrl}${CONDITION_KEYS_API_URL}?${expectedUrlParams}`;
      let response: IOption[];

      service.getConditions(CATEGORY_IDS.CELL_PHONES_ACCESSORIES).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_CONDITIONS);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response).toEqual(MOCK_CONDITIONS_RESPONSE);
      expect(req.request.method).toBe('GET');
    });
  });
});
