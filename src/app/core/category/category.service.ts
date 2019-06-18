import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoryConsumerGoodsResponse, CategoryOption, CategoryResponse } from './category-response.interface';
import { IOption } from 'ng-select';
import { HttpService } from '../http/http.service';
import { I18nService } from '../i18n/i18n.service';

@Injectable()
export class CategoryService {

  private API_URL = 'api/v3/categories';
  private uploadCategories: CategoryOption[];
  private categories: CategoryResponse[];
  private heroCategoriesIds = [100, 13200, 13000, 21000];
  private fashionCategoryId = 12465;

  constructor(private http: HttpService,
              private i18n: I18nService) {
  }

  public getCategoryById(id: number): Observable<CategoryResponse> {
    return this.getCategories().map((categories: CategoryResponse[]) => {
      return categories.find((category: CategoryResponse) => category.categoryId === id);
    });
  }

  public getCategories(): Observable<CategoryResponse[]> {
    if (this.categories) {
      return Observable.of(this.categories);
    }
    return this.http.getNoBase(environment.siteUrl + 'rest/categories')
      .map(res => res.json())
      .do((categories: CategoryResponse[]) => this.categories = categories);
  }

  public getUploadCategories(): Observable<CategoryOption[]> {
    if (this.uploadCategories) {
      return Observable.of(this.uploadCategories);
    }
    const lang = this.i18n.locale === 'es' ? this.i18n.locale + '_ES' : this.i18n.locale;
    return this.http.get(this.API_URL + '/keys/consumer_goods', {language: lang})
      .map(res => res.json())
      .map((categories: CategoryConsumerGoodsResponse[]) => this.toSelectOptions(categories))
      .do((categories: CategoryOption[]) => this.uploadCategories = categories);
  }

  public isHeroCategory(categoryId: number) {
    return this.heroCategoriesIds.indexOf(categoryId) !== -1;
  }

  public isFashionCategory(categoryId: number) {
    return categoryId === this.fashionCategoryId;
  }

  private toSelectOptions(categories: CategoryConsumerGoodsResponse[]): CategoryOption[] {
    return categories.map((category: CategoryConsumerGoodsResponse) => ({
      value: category.category_id.toString(),
      label: category.name,
      icon_id: category.icon_id,
      has_object_type: category.has_object_type,
      has_brand: category.has_brand,
      has_model: category.has_model,
      object_type_title: category.object_type_title
    }));
  }
}
