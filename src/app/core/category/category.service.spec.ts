import { TestBed } from '@angular/core/testing';
import { TEST_HTTP_PROVIDERS, HttpService, I18nService } from 'shield';
import { CategoryService } from './category.service';
import {
  CATEGORIES_DATA_CONSUMER_GOODS, CATEGORIES_OPTIONS,
  CATEGORY_DATA_WEB
} from '../../../tests/category.fixtures';
import { CategoryResponse } from './category-response.interface';
import { ResponseOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { IOption } from 'ng-select';
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
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(CATEGORY_DATA_WEB)});
      spyOn(http, 'getNoBase').and.returnValue(Observable.of(new Response(res)));
      service.getCategories().subscribe((data: CategoryResponse[]) => {
        response = data;
      });
      expect(response).toEqual(CATEGORY_DATA_WEB);
    })
  });

  describe('getUploadCategories', () => {
    it('should return the json from the categories and convert it into options', () => {
      let response: IOption[];
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(CATEGORIES_DATA_CONSUMER_GOODS)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      service.getUploadCategories().subscribe((data: IOption[]) => {
        response = data;
      });
      expect(http.get).toHaveBeenCalledWith('api/v3/categories/keys/consumer_goods', {language: 'es'});
      expect(response).toEqual(CATEGORIES_OPTIONS);
    });
  });

});
