import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOption } from 'ng-select';
import { map, filter } from 'lodash-es';
import { I18nService } from '../../core/i18n/i18n.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CarKeysService {

  private API_URL = `${environment.baseUrl}api/v3/cars/keys`;
  private cache: any[];

  constructor(private http: HttpClient,
              private i18n: I18nService) {
  }

  getTypes(): Observable<IOption[]> {
    return this.getTypesData()
    .do((values: any[]) => this.cache = values)
    .map((values: any[]) => this.toSelectOptions(values));
  }

  getTypeName(id: string): Observable<string> {
    return this.getTypesData()
    .map((values: any[]) => {
      return filter(values, {id: id})[0].text;
    });
  }

  private getTypesData(): Observable<any[]> {
    if (this.cache) {
      return Observable.of(this.cache);
    }

    const params = { language: this.i18n.locale };

    return this.http.get<any[]>(`${this.API_URL}/bodytype`, { params });
  }

  private toSelectOptions(values: any[]): IOption[] {
    return map(values, (item: any) => ({
      value: item.id,
      label: item.text
    }));
  }

}
