import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { CategoriesHttpService } from './http/categories-http.service';
import { CategoriesApiService } from './categories-api.service';
import {
  categoriesFixture,
  mappedSearchCategoriesFixture,
  mappedUploadCategoriesFixture,
} from '@api/fixtures/categories/categories.fixtures';
import { CategoriesFilterOption } from '@public/shared/components/filters/components/categories-filter/interfaces/categories-filter-option.interface';
import { CategoryResponse } from '@core/category/category-response.interface';

describe('CategoriesApiService', () => {
  let service: CategoriesApiService;
  let httpService: CategoriesHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoriesApiService, CategoriesHttpService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CategoriesApiService);
    httpService = TestBed.inject(CategoriesHttpService);
  });

  describe('when asked to retrieve search categories', () => {
    it('should return domain search fcategories', () => {
      spyOn(httpService, 'getCategories').and.returnValue(of(categoriesFixture));
      let response: CategoriesFilterOption[];

      service.getSearchCategories().subscribe((res: CategoriesFilterOption[]) => {
        response = res;
      });

      expect(httpService.getCategories).toHaveBeenCalledTimes(1);
      expect(httpService.getCategories).toHaveBeenCalledWith('search');
      expect(response).toEqual(mappedSearchCategoriesFixture);
    });
  });

  describe('when asked to retrieve upload categories', () => {
    it('should return domain upload fcategories', () => {
      spyOn(httpService, 'getCategories').and.returnValue(of(categoriesFixture));
      let response: CategoryResponse[];

      service.getUploadCategories().subscribe((res: CategoryResponse[]) => {
        response = res;
      });

      expect(httpService.getCategories).toHaveBeenCalledTimes(1);
      expect(httpService.getCategories).toHaveBeenCalledWith('upload');
      expect(response).toEqual(mappedUploadCategoriesFixture);
    });
  });
});
