import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const CARS_SUGGESTER_API_URL = 'api/v3/suggesters/cars';

@Injectable()
export class CarSuggestionsService {
  constructor(private http: HttpClient) {}

  getBrands(): Observable<IOption[]> {
    return this.http
      .get(`${environment.baseUrl}${CARS_SUGGESTER_API_URL}/brands`)
      .pipe(map((values: string[]) => this.toSelectOptions(values)));
  }

  getModels(brand: string): Observable<IOption[]> {
    return this.http
      .get(`${environment.baseUrl}${CARS_SUGGESTER_API_URL}/models`, {
        params: { brand },
      })
      .pipe(map((values: string[]) => this.toSelectOptions(values)));
  }

  getYears(brand: string, model: string): Observable<IOption[]> {
    return this.http
      .get(`${environment.baseUrl}${CARS_SUGGESTER_API_URL}/years`, {
        params: { brand, model },
      })
      .pipe(map((values: string[]) => this.toSelectOptions(values)));
  }

  getVersions(
    brand: string,
    model: string,
    year: string
  ): Observable<IOption[]> {
    return this.http
      .get(`${environment.baseUrl}${CARS_SUGGESTER_API_URL}/versions`, {
        params: { brand, model, year },
      })
      .pipe(map((values: string[]) => this.toSelectOptions(values)));
  }

  private toSelectOptions(values: string[]): IOption[] {
    return values.map((label: string) => ({
      value: label.toString(),
      label: label.toString(),
    }));
  }
}
