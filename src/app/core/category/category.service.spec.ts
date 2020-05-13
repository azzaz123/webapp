
import { of as observableOf } from 'rxjs';
import { TestBed, getTestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import {
  CATEGORY_DATA_WEB
} from '../../../tests/category.fixtures.spec';
import { CategoryResponse } from './category-response.interface';
import { I18nService } from '../i18n/i18n.service';
import { HttpModuleNew } from '../http/http.module.new';
import { HttpClient } from '@angular/common/http';
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

  describe('getConsumerGoodsCategory', () => {
    it('should return a mock consumer goods category', () => {
      const consumerGoodsCategory = service.getConsumerGoodsCategory();

      expect(consumerGoodsCategory.category_id).toBe(0);
      expect(consumerGoodsCategory.name).toBe(i18nService.getTranslations('consumerGoodsGeneralCategoryTitle'));
      expect(consumerGoodsCategory.icon_id).toBe('All');
    });
  })

});
