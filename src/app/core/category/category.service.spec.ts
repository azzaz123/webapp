
import {of as observableOf,  Observable } from 'rxjs';
import { TestBed, getTestBed } from '@angular/core/testing';
import { CategoryService, CONSUMER_GOODS_ENDPOINT } from './category.service';
import {
  CATEGORIES_DATA_CONSUMER_GOODS, CATEGORIES_OPTIONS,
  CATEGORY_DATA_WEB
} from '../../../tests/category.fixtures.spec';
import { CategoryResponse } from './category-response.interface';
import { IOption } from 'ng-select';
import { I18nService } from '../i18n/i18n.service';
import { HttpModuleNew } from '../http/http.module.new';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LOCALE_ID } from '@angular/core';

describe('CategoryService', () => {
  let injector: TestBed;
  let service: CategoryService;
  let http: HttpClient;
  let i18nService: I18nService;

  beforeEach(() => {
    injector = getTestBed();
    injector.configureTestingModule({
      imports: [HttpModuleNew],
      providers: [
        CategoryService,
        I18nService,
        {
          provide: LOCALE_ID, useValue: 'es'
        }
      ]
    });
    service = injector.get(CategoryService);
    http = injector.get(HttpClient);
    i18nService = injector.get(I18nService);
  });

  describe('getCategories', () => {
    it('should return the json from the categories', () => {
      let response: CategoryResponse[];
      spyOn(http, 'get').and.returnValue(observableOf(CATEGORY_DATA_WEB));

      service.getCategories().subscribe((data: CategoryResponse[]) => {
        response = data;
      });

      expect(response).toEqual(CATEGORY_DATA_WEB);
    });
  });

  describe('getUploadCategories', () => {
    let response: IOption[];
    beforeEach(() => {
      response = null;
      spyOn(http, 'get').and.returnValue(observableOf(CATEGORIES_DATA_CONSUMER_GOODS));
    });

    it('should return the json from the categories and convert it into options', () => {
      service.getUploadCategories().subscribe((data: IOption[]) => {
        response = data;
      });

      expect(http.get).toHaveBeenCalledWith(`${environment.baseUrl}${CONSUMER_GOODS_ENDPOINT}`, { params: { language: 'es_ES' }});
      expect(response).toEqual(CATEGORIES_OPTIONS);
    });

    it('should cache results', () => {
      service.getUploadCategories().subscribe((data: IOption[]) => {
        response = data;
      });
      service.getUploadCategories().subscribe((data: IOption[]) => {
        response = data;
      });

      expect(http.get).toHaveBeenCalledTimes(1);
      expect(response).toEqual(CATEGORIES_OPTIONS);
    });
  });

  describe('isHeroCategory', () => {
    it('should return true if categoryId is a hero category', () => {
      expect(service.isHeroCategory(100)).toBeTruthy();
    });

    it('should return false if categoryId is not a hero category', () => {
      expect(service.isHeroCategory(5)).toBeFalsy();
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
