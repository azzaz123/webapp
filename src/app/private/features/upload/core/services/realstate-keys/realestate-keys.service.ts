import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { environment } from '@environments/environment';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { APP_LOCALE } from 'configs/subdomains.config';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Key } from '../../models/key.interface';

export const REAL_ESTATE_KEYS_ENDPOINT = 'api/v3/real_estate/keys';

@Injectable()
export class RealestateKeysService {
  constructor(@Inject(LOCALE_ID) private locale: APP_LOCALE, private http: HttpClient) {}

  getOperations(): Observable<Key[]> {
    const params = {
      language: this.locale,
      filter: 'false',
    };

    return this.http.get<Key[]>(`${environment.baseUrl}${REAL_ESTATE_KEYS_ENDPOINT}/operation`, { params });
  }

  getTypes(operation: string): Observable<Key[]> {
    const params = { language: this.locale, operation };

    return this.http.get<Key[]>(`${environment.baseUrl}${REAL_ESTATE_KEYS_ENDPOINT}/type`, { params });
  }

  getConditions(): Observable<IOption[]> {
    const params = { language: this.locale };

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
    const params = { language: this.locale, type };

    return type ? this.http.get<Key[]>(`${environment.baseUrl}${REAL_ESTATE_KEYS_ENDPOINT}/extra`, { params }) : of([]);
  }
}
