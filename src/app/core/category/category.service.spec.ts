import { TestBed, getTestBed, fakeAsync, tick } from '@angular/core/testing';
import { CategoryService, SUGGESTED_CATEGORIES_ENDPOINT } from './category.service';
import { CATEGORY_DATA_WEB, SUGGESTED_CATEGORIES, SUGGESTED_CATEGORY_TV_AUDIO_CAMERAS } from '../../../tests/category.fixtures.spec';
import { CategoryResponse, SuggestedCategory } from './category-response.interface';
import { I18nService } from '../i18n/i18n.service';
import { HttpParams } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { environment } from 'environments/environment';
import { of, throwError } from 'rxjs';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

describe('CategoryService', () => {
  const defaultIcon = '/assets/icons/categories/stroke/All.svg';
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
          provide: LOCALE_ID,
          useValue: 'es',
        },
      ],
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

      const languageParam = req.request.params.get(languageParamKey);
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
      expect(consumerGoodsCategory.name).toBe(i18nService.translate(TRANSLATION_KEY.CONSUMER_GOODS_GENERAL_CATEGORY_TITLE));
      expect(consumerGoodsCategory.icon_id).toBe('All');
    });
  });

  describe('getSuggestedCategory', () => {
    it('should return the first category if the response has categories', () => {
      const paramKey = 'text';
      const paramValue = 'car';
      const expectedParams = new HttpParams().set(paramKey, paramValue);
      const expectedUrl = `${environment.baseUrl}${SUGGESTED_CATEGORIES_ENDPOINT}`;
      let response: SuggestedCategory;

      service.getSuggestedCategory(paramValue).subscribe((data: SuggestedCategory) => {
        response = data;
      });
      const req: TestRequest = httpMock.expectOne(`${expectedUrl}?${expectedParams.toString()}`);
      req.flush(SUGGESTED_CATEGORIES);

      const languageParam = req.request.params.get(paramKey);
      expect(req.request.url).toEqual(expectedUrl);
      expect(req.request.method).toBe('GET');
      expect(languageParam).toEqual(paramValue);
      expect(response).toEqual(SUGGESTED_CATEGORY_TV_AUDIO_CAMERAS);
    });

    it('should return null if the response has no categories', () => {
      const paramKey = 'text';
      const paramValue = 'car';
      const expectedParams = new HttpParams().set(paramKey, paramValue);
      const expectedUrl = `${environment.baseUrl}${SUGGESTED_CATEGORIES_ENDPOINT}`;
      let response: SuggestedCategory;

      service.getSuggestedCategory(paramValue).subscribe((data: SuggestedCategory) => {
        response = data;
      });
      const req: TestRequest = httpMock.expectOne(`${expectedUrl}?${expectedParams.toString()}`);
      req.flush([]);

      const languageParam = req.request.params.get(paramKey);
      expect(req.request.url).toEqual(expectedUrl);
      expect(req.request.method).toBe('GET');
      expect(languageParam).toEqual(paramValue);
      expect(response).toEqual(null);
    });
  });

  describe('getCategoryIconById', () => {
    describe('when the categories petition succed...', () => {
      beforeEach(() => {
        spyOn(service, 'getCategories').and.returnValue(of(CATEGORY_DATA_WEB));
      });

      describe('and the id is in the categories list...', () => {
        it('should return the category icon', fakeAsync(() => {
          const iconPath = '/assets/icons/categories/stroke/';
          let response: string;

          service.getCategoryIconById(CATEGORY_DATA_WEB[0].category_id).subscribe((data: string) => {
            response = data;
          });
          tick();

          expect(response).toBe(`${iconPath}${CATEGORY_DATA_WEB[0].icon_id}.svg`);
        }));
      });

      describe('and the id is NOT in the categories list...', () => {
        it('should return the default icon', fakeAsync(() => {
          let response: string;

          service.getCategoryIconById(23982382).subscribe((data: string) => {
            response = data;
          });
          tick();

          expect(response).toBe(defaultIcon);
        }));
      });
    });

    describe('when the categories petition fails...', () => {
      it('should return the default icon', fakeAsync(() => {
        spyOn(service, 'getCategories').and.returnValue(throwError('network error'));
        let response: string;

        service.getCategoryIconById(CATEGORY_DATA_WEB[0].category_id).subscribe((data: string) => {
          response = data;
        });
        tick();

        expect(response).toBe(defaultIcon);
      }));
    });
  });
});
