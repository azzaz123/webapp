import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { I18nService } from '@core/i18n/i18n.service';
import { environment } from '@environments/environment';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { APP_LOCALE } from 'configs/subdomains.config';
import { filter } from 'lodash-es';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export const CARS_KEYS_ENDPOINT = 'api/v3/cars/keys';

@Injectable()
export class CarKeysService {
  private cache: any[];

  constructor(@Inject(LOCALE_ID) private locale: APP_LOCALE, private http: HttpClient) {}

  getTypes(): Observable<IOption[]> {
    return this.getTypesData().pipe(
      tap((values: any[]) => (this.cache = values)),
      map((values: any[]) => this.toSelectOptions(values))
    );
  }

  getTypeName(id: string): Observable<string> {
    return this.getTypesData().pipe(
      map((values: any[]) => {
        return filter(values, { id: id })[0].text;
      })
    );
  }

  private getTypesData(): Observable<any[]> {
    if (this.cache) {
      return of(this.cache);
    }

    const params = { language: this.locale };

    return this.http.get<any[]>(`${environment.baseUrl}${CARS_KEYS_ENDPOINT}/bodytype`, { params });
  }

  private toSelectOptions(values: any[]): IOption[] {
    return values.map((item) => ({
      value: item.id,
      label: item.text,
      icon_id: `assets/icons/${item.icon_id}.svg`,
    }));
  }
}
