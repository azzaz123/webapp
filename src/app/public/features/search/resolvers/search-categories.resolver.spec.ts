import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { CategoriesApiService } from '@api/categories/categories-api.service';
import { mappedSearchCategoriesFixture } from '@api/fixtures/categories/categories.fixtures';
import { CategoriesFilterOption } from '@public/shared/components/filters/components/categories-filter/interfaces/categories-filter-option.interface';
import { of } from 'rxjs';

import { SearchCategoriesResolver } from './search-categories.resolver';

describe('SearchCategoriesResolver', () => {
  let resolver: SearchCategoriesResolver;
  let categoriesApiService: CategoriesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchCategoriesResolver,
        {
          provide: CategoriesApiService,
          useValue: {
            getSearchCategories() {
              return of(mappedSearchCategoriesFixture);
            },
          },
        },
      ],
    });
    resolver = TestBed.inject(SearchCategoriesResolver);
    categoriesApiService = TestBed.inject(CategoriesApiService);
  });

  it('should return Observable with item', () => {
    let returnedCategories: CategoriesFilterOption[];
    spyOn(categoriesApiService, 'getSearchCategories').and.callThrough();

    resolver.resolve().subscribe((categories: CategoriesFilterOption[]) => {
      returnedCategories = categories;
    });

    expect(categoriesApiService.getSearchCategories).toHaveBeenCalled();
    expect(returnedCategories).toEqual(mappedSearchCategoriesFixture);
  });
});
