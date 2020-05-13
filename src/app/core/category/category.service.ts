
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CategoryResponse } from './category-response.interface';
import { I18nService } from '../i18n/i18n.service';
import { environment } from '../../../environments/environment';

export const CATEGORIES_ENDPOINT = 'api/v3/categories/keys/';
export const CONSUMER_GOODS_ENDPOINT = `${CATEGORIES_ENDPOINT}consumer_goods`;

@Injectable()
export class CategoryService {
  private categories: CategoryResponse[];
  private heroCategoriesIds = [100, 13200, 13000, 21000];
  private lang = this.i18n.locale === 'es' ? this.i18n.locale + '_ES' : this.i18n.locale;

  constructor(private http: HttpClient,
    private i18n: I18nService) {
  }

  public getCategoryById(id: number): Observable<CategoryResponse> {
    return this.getCategories().pipe(map(categories => categories.find(category => category.category_id === id)));
  }

  public getCategories(): Observable<CategoryResponse[]> {
    if (this.categories) {
      return of(this.categories);
    }
    return this.http.get<CategoryResponse[]>(`${environment.baseUrl}${CATEGORIES_ENDPOINT}`, {
      params: { language: this.lang },
      headers: {
        'Accept': 'application/vnd.categories-v2+json'
      }
    });
  }

  public isHeroCategory(categoryId: number) {
    return this.heroCategoriesIds.indexOf(categoryId) !== -1;
  }

  public getConsumerGoodsCategory(): CategoryResponse {
    return {
      category_id: 0,
      name: this.i18n.getTranslations('consumerGoodsGeneralCategoryTitle'),
      icon_id: 'All',
      vertical_id: 'consumer_goods'
    }
  }
}
