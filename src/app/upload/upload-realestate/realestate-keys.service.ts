import { Injectable } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';
import { Key } from './key.interface';
import { IOption } from 'ng-select';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RealestateKeysService {

  private API_URL = `${environment.baseUrl}api/v3/real_estate/keys`;

  constructor(private http: HttpClient,
              private i18n: I18nService) {
  }

  getOperations(): Observable<Key[]> {
    const params = {
      language: this.i18n.locale,
      filter: 'false'
    };

    return this.http.get<Key[]>(`${this.API_URL}/operation`, {params});
  }

  getTypes(operation: string): Observable<Key[]> {
    const params = { language: this.i18n.locale, operation: operation };

    return this.http.get<Key[]>(this.API_URL + '/type', { params }
    );
  }

  getConditions(): Observable<IOption[]> {
    const params = {language: this.i18n.locale};

    return this.http.get(this.API_URL + '/condition', {params})
      .map((keys: Key[]) => {
        return keys.map((item: Key) => ({
          value: item.id,
          label: item.text
        }));
      });
  }

  getExtras(type: string): Observable<Key[]> {
    const params = {language: this.i18n.locale, type: type};

    return this.http.get(this.API_URL + '/extra', {params})
      .map((r: Response) => r.json());
  }

}
