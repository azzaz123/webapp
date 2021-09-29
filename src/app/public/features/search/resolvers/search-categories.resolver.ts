import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CategoriesApiService } from '@api/categories/categories-api.service';
import { CategoriesFilterOption } from '@public/shared/components/filters/components/categories-filter/interfaces/categories-filter-option.interface';
import { Observable } from 'rxjs';

@Injectable()
export class SearchCategoriesResolver implements Resolve<CategoriesFilterOption[]> {
  constructor(private categoriesApiService: CategoriesApiService) {}

  resolve(): Observable<CategoriesFilterOption[]> {
    return this.categoriesApiService.getSearchCategories();
  }
}
