import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import {
  CATEGORIES_DATA_CONSUMER_GOODS, CATEGORIES_OPTIONS,
  CATEGORY_DATA_WEB
} from '../../../tests/category.fixtures.spec';
import { CategoryResponse } from './category-response.interface';
import { ResponseOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { IOption } from 'ng-select';
import { HttpService } from '../http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { I18nService } from '../i18n/i18n.service';
let service: CategoryService;
let http: HttpService;

describe('CategoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoryService,
        ...TEST_HTTP_PROVIDERS,
        {
          provide: I18nService, useValue: {
            locale: 'es'
          }
        }
      ]
    });
    service = TestBed.get(CategoryService);
    http = TestBed.get(HttpService);
  });

  describe('getCategories', () => {
    it('should return the json from the categories', () => {
      let response: CategoryResponse[];
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(CATEGORY_DATA_WEB) });
      spyOn(http, 'getNoBase').and.returnValue(Observable.of(new Response(res)));

      service.getCategories().subscribe((data: CategoryResponse[]) => {
        response = data;
      });

      expect(response).toEqual(CATEGORY_DATA_WEB);
    });
  });

  describe('getUploadCategories', () => {
    let response: IOption[];
    const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(CATEGORIES_DATA_CONSUMER_GOODS) });
    beforeEach(() => {
      response = null;
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
    });

    it('should return the json from the categories and convert it into options', () => {
      service.getUploadCategories().subscribe((data: IOption[]) => {
        response = data;
      });

      expect(http.get).toHaveBeenCalledWith('api/v3/categories/keys/consumer_goods', { language: 'es_ES' });
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

  describe('isFashionCategory', () => {
    it('should return true if the category is Fashion&Accessories', () => {
      const isFashionCategory = service.isFashionCategory(service['fashionCategoryId']);

      expect(isFashionCategory).toEqual(true);
    });
  });

});
