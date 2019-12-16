import { TestBed } from '@angular/core/testing';
import { CategoryService, CATEGORIES_ENDPOINT } from './category.service';
import {
  CATEGORIES_DATA_CONSUMER_GOODS, CATEGORIES_OPTIONS,
  CATEGORY_DATA_WEB
} from '../../../tests/category.fixtures.spec';
import { CategoryResponse } from './category-response.interface';
import { Observable } from 'rxjs';
import { IOption } from 'ng-select';
import { I18nService } from '../i18n/i18n.service';
import { HttpModuleNew } from '../http/http.module.new';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

let service: CategoryService;
let http: HttpClient;

describe('CategoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModuleNew],
      providers: [
        CategoryService,
        {
          provide: I18nService, useValue: {
            locale: 'es'
          }
        }
      ]
    });
    service = TestBed.get(CategoryService);
    http = TestBed.get(HttpClient);
  });

  describe('getCategories', () => {
    it('should return the json from the categories', () => {
      let response: CategoryResponse[];
      spyOn(http, 'get').and.returnValue(Observable.of(CATEGORY_DATA_WEB));

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
      spyOn(http, 'get').and.returnValue(Observable.of(CATEGORIES_DATA_CONSUMER_GOODS));
    });

    it('should return the json from the categories and convert it into options', () => {
      service.getUploadCategories().subscribe((data: IOption[]) => {
        response = data;
      });

      expect(http.get).toHaveBeenCalledWith(
        `${environment.baseUrl}${CATEGORIES_ENDPOINT}keys/consumer_goods`,
        { params: { key: 'language', value: 'es_ES' }}
      );
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
