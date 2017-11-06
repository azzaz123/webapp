import { TestBed } from '@angular/core/testing';
import { TEST_HTTP_PROVIDERS, HttpService, I18nService } from 'shield';
import { CategoryService } from './category.service';
import { CATEGORY_DATA_WEB } from '../../../tests/category.fixtures';
import { CategoryResponse } from './category-response.interface';
import { ResponseOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
let service: CategoryService;
let http: HttpService;

describe('CategoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoryService,
        ...TEST_HTTP_PROVIDERS,
        I18nService
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
    xit('should ', () => {

    });
  });

});
