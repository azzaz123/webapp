import { Injectable } from '@angular/core';
import { HttpService } from '../../core/http/http.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { Key } from './key.interface';
import { IOption } from 'ng-select';

@Injectable()
export class RealestateKeysService {

  private API_URL = 'api/v3/real_estate/keys';

  constructor(private http: HttpService,
              private i18n: I18nService) {
  }

  getOperations(): Observable<Key[]> {
    return this.http.get(this.API_URL + '/operation', {language: this.i18n.locale, filter: false})
      .map((r: Response) => r.json());
  }

  getTypes(operation: string): Observable<Key[]> {
    return this.http.get(this.API_URL + '/type', {language: this.i18n.locale, operation: operation})
      .map((r: Response) => r.json());
  }

  getConditions(): Observable<IOption[]> {
    return this.http.get(this.API_URL + '/condition', {language: this.i18n.locale})
      .map((r: Response) => r.json())
      .map((keys: Key[]) => {
        return keys.map((item: Key) => ({
          value: item.id,
          label: item.text
        }));
      });
  }

  getExtras(type: string): Observable<Key[]> {
    return this.http.get(this.API_URL + '/extra', {language: this.i18n.locale, type: type})
      .map((r: Response) => r.json());
  }

}
