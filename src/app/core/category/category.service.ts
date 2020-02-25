import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CategoryOption, CategoryResponse } from './category-response.interface';
import { I18nService } from '../i18n/i18n.service';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

export const CATEGORIES_ENDPOINT = 'api/v3/categories/keys/';
export const CONSUMER_GOODS_ENDPOINT = `${CATEGORIES_ENDPOINT}consumer_goods`;

@Injectable()
export class CategoryService {
  private uploadCategories: CategoryOption[];
  private categories: CategoryResponse[];
  private heroCategoriesIds = [100, 13200, 13000, 21000];
  private fashionCategoryId = 12465;
  private lang = this.i18n.locale === 'es' ? this.i18n.locale + '_ES' : this.i18n.locale;

  constructor(private http: HttpClient,
    private i18n: I18nService) {
  }

  public getCategoryById(id: number): Observable<CategoryResponse> {
    return this.getCategories().map(categories => categories.find(category => category.category_id === id));
  }

  public getCategories(): Observable<CategoryResponse[]> {
    if (this.categories) {
      return Observable.of(this.categories);
    }
    return this.http.get<CategoryResponse[]>(`${environment.baseUrl}${CATEGORIES_ENDPOINT}`, { params: { language: this.lang }});
  }

  public getUploadCategories(): Observable<CategoryOption[]> {
    if (this.uploadCategories) {
      return Observable.of(this.uploadCategories);
    }
    return this.http
      .get(`${environment.baseUrl}${CONSUMER_GOODS_ENDPOINT}`, { params: { language: this.lang }})
      .map((categories: CategoryResponse[]) => this.toSelectOptions(categories))
      .do((categories: CategoryOption[]) => this.uploadCategories = categories);
  }

  public isHeroCategory(categoryId: number) {
    return this.heroCategoriesIds.indexOf(categoryId) !== -1;
  }

  private toSelectOptions(categories: CategoryResponse[]): CategoryOption[] {
    return categories.map((category: CategoryResponse) => ({
      value: category.category_id.toString(),
      label: category.name,
      icon_id: category.icon_id,
      has_object_type: category.has_object_type,
      has_brand: category.has_brand,
      has_model: category.has_model,
      object_type_title: category.object_type_title
    }));
  }

  public getConsumerGoodsCategory(): CategoryResponse {
    return {
      category_id: 0,
      name: this.i18n.getTranslations('consumerGoodsGeneralCategoryTitle'),
      icon_id: 'All',
      vertical_id: 'consumer_goods',
      has_object_type: false,
      has_brand: false,
      has_model: false
    }
  }
}
