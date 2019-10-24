import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOption } from 'ng-select';
import { Response } from '@angular/http';
import { map, filter } from 'lodash';
import { HttpService } from '../../core/http/http.service';
import { I18nService } from '../../core/i18n/i18n.service';

@Injectable()
export class CarKeysService {

  private API_URL = 'api/v3/cars/keys';
  private cache: any[];

  constructor(private http: HttpService,
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
    return this.http.get(this.API_URL + '/bodytype', {language: this.i18n.locale})
    .map((r: Response) => r.json());
  }

  private toSelectOptions(values: any[]): IOption[] {
    return map(values, (item: any) => ({
      value: item.id,
      label: item.text
    }));
  }

}
