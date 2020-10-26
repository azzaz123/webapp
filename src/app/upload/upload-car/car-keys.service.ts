import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IOption } from 'app/dropdown/utils/option.interface';
import { filter } from 'lodash-es';
import { I18nService } from '../../core/i18n/i18n.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

export const CARS_KEYS_ENDPOINT = 'api/v3/cars/keys';

@Injectable()
export class CarKeysService {

  private cache: any[];

  constructor(private http: HttpClient,
    private i18n: I18nService) {
  }

  getTypes(): Observable<IOption[]> {
    return this.getTypesData()
      .pipe(
        tap((values: any[]) => this.cache = values),
        map((values: any[]) => this.toSelectOptions(values))
      );
  }

  getTypeName(id: string): Observable<string> {
    return this.getTypesData()
      .pipe(map((values: any[]) => {
        return filter(values, { id: id })[0].text;
      }));
  }

  private getTypesData(): Observable<any[]> {
    if (this.cache) {
      return of(this.cache);
    }

    const params = { language: this.i18n.locale };

    return this.http.get<any[]>(`${environment.baseUrl}${CARS_KEYS_ENDPOINT}/bodytype`, { params });
  }

  private toSelectOptions(values: any[]): IOption[] {
    return values.map(item => ({
      value: item.id,
      label: item.text
    }));
  }

}
