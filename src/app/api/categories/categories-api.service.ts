import { Injectable } from '@angular/core';
import { CategoriesHttpService } from './http/categories-http.service';
import { mapCategoriesToSearchCategories, mapCategoriesToUploadCategories } from './mappers/category-mapper';
import { CategoriesFilterOption } from '@public/shared/components/filters/components/categories-filter/interfaces/categories-filter-option.interface';
import { CategoryResponse } from '@core/category/category-response.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CategoriesApiService {
  constructor(private categoriesHttpService: CategoriesHttpService) {}

  public getSearchCategories(): Observable<CategoriesFilterOption[]> {
    return this.categoriesHttpService.getCategories('search').pipe(
      map((categories) => {
        return mapCategoriesToSearchCategories(categories);
      })
    );
  }

  public getUploadCategories(): Observable<CategoryResponse[]> {
    return this.categoriesHttpService.getCategories('upload').pipe(
      map((categories) => {
        return mapCategoriesToUploadCategories(categories);
      })
    );
  }
}
