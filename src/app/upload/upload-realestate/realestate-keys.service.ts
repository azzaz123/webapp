import { Injectable } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { Observable, of } from 'rxjs';
import { Key } from './key.interface';
import { IOption } from 'app/dropdown/utils/option.interface';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export const REAL_ESTATE_KEYS_ENDPOINT = 'api/v3/real_estate/keys';

@Injectable()
export class RealestateKeysService {
  constructor(private http: HttpClient, private i18n: I18nService) {}

  getOperations(): Observable<Key[]> {
    const params = {
      language: this.i18n.locale,
      filter: 'false',
    };

    return this.http.get<Key[]>(
      `${environment.baseUrl}${REAL_ESTATE_KEYS_ENDPOINT}/operation`,
      { params }
    );
  }

  getTypes(operation: string): Observable<Key[]> {
    const params = { language: this.i18n.locale, operation };

    return this.http.get<Key[]>(
      `${environment.baseUrl}${REAL_ESTATE_KEYS_ENDPOINT}/type`,
      { params }
    );
  }

  getConditions(): Observable<IOption[]> {
    const params = { language: this.i18n.locale };

    return this.http
      .get(`${environment.baseUrl}${REAL_ESTATE_KEYS_ENDPOINT}/condition`, {
        params,
      })
      .pipe(
        map((keys: Key[]) => {
          return keys.map((item: Key) => ({
            value: item.id,
            label: item.text,
            icon_id: `assets/icons/${item.icon_id}.svg`,
          }));
        })
      );
  }

  getExtras(type: string): Observable<Key[]> {
    const params = { language: this.i18n.locale, type };

    return type
      ? this.http.get<Key[]>(
          `${environment.baseUrl}${REAL_ESTATE_KEYS_ENDPOINT}/extra`,
          { params }
        )
      : of([]);
  }
}
