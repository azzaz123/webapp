import { Injectable } from '@angular/core';
import { HttpService, I18nService } from 'shield';
import { Observable } from 'rxjs/Observable';
import { IOption } from 'ng-select';
import { Response } from '@angular/http';
import * as _ from 'lodash';

@Injectable()
export class CarKeysService {

  private API_URL: string = 'api/v3/cars/keys';

  constructor(private http: HttpService,
              private i18n: I18nService) {
  }

  getTypes(): Observable<IOption[]> {
    return this.http.get(this.API_URL + '/bodytype', {language: this.i18n.locale})
    .map((r: Response) => r.json())
    .map((values: any[]) => this.toSelectOptions(values));
  }

  private toSelectOptions(values: any[]): IOption[] {
    return _.map(values, (item: any) => ({
      value: item.id,
      label: item.text
    }));
  }

}
