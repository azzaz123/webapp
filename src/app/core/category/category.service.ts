import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService, I18nService } from 'shield';
import { environment } from '../../../environments/environment';
import { CategoryConsumerGoodsResponse, CategoryOption, CategoryResponse } from './category-response.interface';
import { IOption } from 'ng-select';

@Injectable()
export class CategoryService {

  private API_URL = 'api/v3/categories';
  private categories: CategoryOption[];

  constructor(private http: HttpService,
              private i18n: I18nService) {
  }

  public getCategories(): Observable<CategoryResponse[]> {
    return this.http.getNoBase(environment.siteUrl + 'rest/categories')
      .map(res => res.json());
  }

  public getUploadCategories(): Observable<CategoryOption[]> {
    if (this.categories) {
      return Observable.of(this.categories);
    }
    return this.http.get(this.API_URL + '/keys/consumer_goods', {language: this.i18n.locale})
      .map(res => res.json())
      .map((categories: CategoryConsumerGoodsResponse[]) => this.toSelectOptions(categories))
      .do((categories: CategoryOption[]) => this.categories = categories);
  }

  private toSelectOptions(categories: CategoryConsumerGoodsResponse[]): CategoryOption[] {
    return categories.map((category: CategoryConsumerGoodsResponse) => ({
      value: category.category_id.toString(),
      label: category.name,
      icon_id: category.icon_id
    }));
  }

}
