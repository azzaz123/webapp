import { Injectable } from '@angular/core';
import { CategoriesHttpService } from './http/categories-http.service';
import { mapCategoriesToSearchCategories, mapCategoriesToUploadCategories } from './mappers/category-mapper';
import { CategoriesFilterOption } from '@public/shared/components/filters/components/categories-filter/interfaces/categories-filter-option.interface';
import { CategoryResponse } from '@core/category/category-response.interface';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CategoryWithPresentation } from '@core/category/category-with-presentation.interface';

@Injectable()
export class CategoriesApiService {
  private searchCategories: CategoriesFilterOption[];
  private categoriesWithPresentation: CategoryWithPresentation[];
  private flatCategoriesWithPresentation: CategoryWithPresentation[];

  constructor(private categoriesHttpService: CategoriesHttpService) {}

  public getSearchCategories(): Observable<CategoriesFilterOption[]> {
    if (this.searchCategories) {
      return of(this.searchCategories);
    } else {
      return this.categoriesHttpService.getCategories('search').pipe(
        map((categories) => {
          return mapCategoriesToSearchCategories(categories);
        }),
        tap((categories) => (this.searchCategories = categories))
      );
    }
  }

  public getUploadCategories(): Observable<CategoryResponse[]> {
    return this.categoriesHttpService.getCategories('upload').pipe(
      map((categories) => {
        return mapCategoriesToUploadCategories(categories);
      })
    );
  }

  public getCategoriesWithPresentation(): Observable<CategoryWithPresentation[]> {
    if (this.categoriesWithPresentation) {
      return of(this.categoriesWithPresentation);
    } else {
      return this.categoriesHttpService.getCategoriesWithPresentation().pipe(
        map((response) => {
          return response.categories;
        }),
        tap((categories) => {
          this.categoriesWithPresentation = categories;

          const flattenDeep = (arr1: CategoryWithPresentation[]) => {
            return arr1.reduce(
              (acc, val) => (val.subcategories.length ? acc.concat(flattenDeep(val.subcategories), val) : acc.concat(val)),
              []
            );
          };

          this.flatCategoriesWithPresentation = flattenDeep(categories);
        })
      );
    }
  }

  public getCategoryWithPresentationById(id: number): Observable<CategoryWithPresentation> {
    return this.getCategoriesWithPresentation().pipe(
      map(() => {
        return this.flatCategoriesWithPresentation.find((category) => category.id === id);
      })
    );
  }

  public getCategoriesWithPresentationByParentId(id: number): Observable<CategoryWithPresentation[]> {
    return this.getCategoriesWithPresentation().pipe(
      map((categories) => {
        return categories.find((category) => category.id === id).subcategories || [];
      })
    );
  }
}
