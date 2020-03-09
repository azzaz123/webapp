import { TestBed } from '@angular/core/testing';

import { GeneralSuggestionsService, SUGGESTERS_API_URL, FASHION_KEYS_API_URL, CONDITION_KEYS_API_URL } from './general-suggestions.service';
import { IOption } from 'ng-select';
import { BrandModel, Brand, Model } from '../brand-model.interface';
import { I18nService } from '../../core/i18n/i18n.service';
import { CATEGORY_IDS } from '../../core/category/category-ids';
import { environment } from '../../../environments/environment';
import { TestRequest, HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

const MOCK_OBJECT_TYPES = [{
  id: '1',
  name: 'object type 1'
}, {
  id: '2',
  name: 'object type 2'
}];
const MOCK_OBJECT_TYPES_RESPONSE = [{
  value: '1',
  label: 'object type 1'
}, {
  value: '2',
  label: 'object type 2'
}];
const MOCK_BRAND_MODEL_RESPONSE = [{
  brand: 'brand1',
  model: 'model1'
}, {
  brand: 'brand2',
  model: 'model2'
}];
const MOCK_MODELS_RESPONSE = [{ model: 'model1' }, { model: 'model2' }];
const MOCK_BRANDS_RESPONSE = [{ brand: 'brand1' }, { brand: 'brand2' }];
const MOCK_BRAND = 'Apple';
const MOCK_MODEL = 'iPhone';
const MOCK_OBJECT_TYPE_ID = 130;
const MOCK_GENDER = 'male';
const MOCK_SIZES = {
  female: [{
    id: 34, text: '35'
  }],
  male: [{
    id: 57, text: '48'
  }]
};
const MOCK_SIZES_RESPONSE = [{
  value: '57',
  label: '48'
}];

const MOCK_CONDITIONS = [
  {
    category_id: "16000",
    conditions: [
      {
        id: "un_opened",
        title: "Unopened",
        description: "With its seal"
      },
      {
        id: "new",
        title: "New",
        description: "Never been used"
      },
      {
        id: "as_good_as_new",
        title: "As good as new",
        description: "In perfect condition"
      },
      {
        id: "good",
        title: "Good",
        description: "Quite used, but well preserved"
      },
      {
        id: "fair",
        title: "Fair",
        description: "With evidents signs of use"
      },
      {
        id: "has_given_it_all",
        title: "Has given it all",
        description: "May have to be repaired"
      }
    ]
  }];

const MOCK_CONDITIONS_RESPONSE = [
  {
    value: "un_opened",
    label: "Unopened",
    description: "With its seal"
  },
  {
    value: "new",
    label: "New",
    description: "Never been used"
  },
  {
    value: "as_good_as_new",
    label: "As good as new",
    description: "In perfect condition"
  },
  {
    value: "good",
    label: "Good",
    description: "Quite used, but well preserved"
  },
  {
    value: "fair",
    label: "Fair",
    description: "With evidents signs of use"
  },
  {
    value: "has_given_it_all",
    label: "Has given it all",
    description: "May have to be repaired"
  }
];

describe('GeneralSuggestionsService', () => {

  let service: GeneralSuggestionsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GeneralSuggestionsService,
        I18nService,
      ],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.get(GeneralSuggestionsService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getObjectTypes', () => {
    it('should call the object-type endpoint and return object types', () => {
      const expectedUrlParams = `category_id=${CATEGORY_IDS.CELL_PHONES_ACCESSORIES}&language=en`;
      const expectedUrl = `${environment.baseUrl}${SUGGESTERS_API_URL}/object-type?${expectedUrlParams}`;
      let response: IOption[];

      service.getObjectTypes(CATEGORY_IDS.CELL_PHONES_ACCESSORIES).subscribe(r => response = r);
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_OBJECT_TYPES);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response).toEqual(MOCK_OBJECT_TYPES_RESPONSE);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('getBrandsAndModels', () => {
    it('should call the brand-model endpoint and return brand&model results', () => {
      const expectedUrlParams = `text=${MOCK_BRAND}&category_id=${CATEGORY_IDS.CELL_PHONES_ACCESSORIES}&object_type_id=${MOCK_OBJECT_TYPE_ID}`;
      const expectedUrl = `${environment.baseUrl}${SUGGESTERS_API_URL}/brand-model?${expectedUrlParams}`;
      let response: BrandModel[];

      service.getBrandsAndModels(MOCK_BRAND, CATEGORY_IDS.CELL_PHONES_ACCESSORIES, MOCK_OBJECT_TYPE_ID).subscribe(r => response = r);
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

      service.getModels(MOCK_MODEL, CATEGORY_IDS.CELL_PHONES_ACCESSORIES, MOCK_BRAND, MOCK_OBJECT_TYPE_ID).subscribe(r => response = r);
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

      service.getBrands(MOCK_MODEL, CATEGORY_IDS.CELL_PHONES_ACCESSORIES, MOCK_OBJECT_TYPE_ID).subscribe(r => response = r);
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

      service.getSizes(MOCK_OBJECT_TYPE_ID, MOCK_GENDER).subscribe(r => response = r);
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

      service.getConditions(CATEGORY_IDS.CELL_PHONES_ACCESSORIES).subscribe(r => response = r);
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_CONDITIONS);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response).toEqual(MOCK_CONDITIONS_RESPONSE);
      expect(req.request.method).toBe('GET');
    });
  });

});
