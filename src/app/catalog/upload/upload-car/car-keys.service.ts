import { Injectable } from '@angular/core';
import { HttpService, I18nService } from 'shield';
import { Observable } from 'rxjs/Observable';
import { IOption } from 'ng-select';
import { Response } from '@angular/http';
import * as _ from 'lodash';

@Injectable()
export class CarKeysService {

  private API_URL: string = 'api/v3/cars/keys';
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
      return _.filter(values, {id: id})[0].text;
    })
  }

  private getTypesData(): Observable<any[]> {
    if (this.cache) {
      return Observable.of(this.cache);
    }
    return this.http.get(this.API_URL + '/bodytype', {language: this.i18n.locale})
    .map((r: Response) => r.json());
  }

  private toSelectOptions(values: any[]): IOption[] {
    return _.map(values, (item: any) => ({
      value: item.id,
      label: item.text
    }));
  }

}
