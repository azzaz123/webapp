
import { TestBed, getTestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import { CATEGORY_DATA_WEB } from '../../../tests/category.fixtures.spec';
import { CategoryResponse } from './category-response.interface';
import { I18nService } from '../i18n/i18n.service';
import { HttpParams } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { environment } from 'environments/environment';

describe('CategoryService', () => {
  let injector: TestBed;
  let service: CategoryService;
  let httpMock: HttpTestingController;
  let i18nService: I18nService;

  beforeEach(() => {
    injector = getTestBed();
    injector.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CategoryService,
        I18nService,
        {
          provide: LOCALE_ID, useValue: 'es'
        }
      ]
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
    i18nService = TestBed.inject(I18nService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getCategories', () => {
    it('should return the json from the categories', () => {
      const languageParamKey = 'language';
      const languageParamValue = 'es_ES';
      const expectedParams = new HttpParams().set(languageParamKey, languageParamValue);
      const expectedUrl = `${environment.baseUrl}api/v3/categories/keys/`;
      let response: CategoryResponse[];

      service.getCategories().subscribe((data: CategoryResponse[]) => {
        response = data;
      });
      const req: TestRequest = httpMock.expectOne(`${expectedUrl}?${expectedParams.toString()}`);
      req.flush(CATEGORY_DATA_WEB);

      const languageParam = req.request.params.get(languageParamKey)
      expect(response).toEqual(CATEGORY_DATA_WEB);
      expect(req.request.url).toEqual(expectedUrl);
      expect(req.request.method).toBe('GET');
      expect(languageParam).toEqual(languageParamValue);
      expect(req.request.headers.get('Accept')).toBe('application/vnd.categories-v2+json');
    });

    it('should return categories fetched previously', () => {
      const languageParamKey = 'language';
      const languageParamValue = 'es_ES';
      const expectedParams = new HttpParams().set(languageParamKey, languageParamValue);
      const expectedUrl = `${environment.baseUrl}api/v3/categories/keys/`;
      let response: CategoryResponse[];

      service.getCategories().subscribe((data: CategoryResponse[]) => {
        response = data;
      });
      const req: TestRequest = httpMock.expectOne(`${expectedUrl}?${expectedParams.toString()}`);
      req.flush(CATEGORY_DATA_WEB);
      service.getCategories().subscribe((data: CategoryResponse[]) => {
        response = data;
      });


      httpMock.expectNone(`${expectedUrl}?${expectedParams.toString()}`);
      expect(response).toEqual(CATEGORY_DATA_WEB);
    });
  });

  describe('getConsumerGoodsCategory', () => {
    it('should return a mock consumer goods category', () => {
      const consumerGoodsCategory = service.getConsumerGoodsCategory();

      expect(consumerGoodsCategory.category_id).toBe(0);
      expect(consumerGoodsCategory.name).toBe(i18nService.getTranslations('consumerGoodsGeneralCategoryTitle'));
      expect(consumerGoodsCategory.icon_id).toBe('All');
    });
  })

});
