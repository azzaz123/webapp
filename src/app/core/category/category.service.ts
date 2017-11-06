import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService, I18nService } from 'shield';
import { environment } from '../../../environments/environment';
import { CategoryResponse } from './category-response.interface';
import { IOption } from 'ng-select';

@Injectable()
export class CategoryService {

  private API_URL = 'api/v3/categories';

  constructor(private http: HttpService,
              private i18n: I18nService) { }

  public getCategories(): Observable<CategoryResponse[]> {
    return this.http.getNoBase(environment.siteUrl + 'rest/categories')
      .map(res => res.json());
  }

  public getUploadCategories(): Observable<IOption[]> {
    return this.http.get(this.API_URL + '/keys/consumer_goods', {language: this.i18n.locale})
    .map(res => res.json())
    .map((values: any[]) => this.toSelectOptions(values));
  }

  private toSelectOptions(values: any[]): IOption[] {
    return values.map((item: any) => ({
      value: item.category_id.toString(),
      label: item.name
    }));
  }

}
