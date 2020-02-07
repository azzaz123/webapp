import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'lodash-es';
import { IOption } from 'ng-select';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

export const CARS_SUGGESTER_API_URL = 'api/v3/suggesters/cars';

@Injectable()
export class CarSuggestionsService {

  constructor(private http: HttpClient) {
  }

  getBrands(): Observable<IOption[]> {
    return this.http.get(`${environment.baseUrl}${CARS_SUGGESTER_API_URL}/brands`)
      .map((values: string[]) => this.toSelectOptions(values));
  }

  getModels(brand: string): Observable<IOption[]> {
    return this.http.get(`${environment.baseUrl}${CARS_SUGGESTER_API_URL}/models`, { params: { brand } })
      .map((values: string[]) => this.toSelectOptions(values));
  }

  getYears(brand: string, model: string): Observable<IOption[]> {
    return this.http.get(`${environment.baseUrl}${CARS_SUGGESTER_API_URL}/years`, { params: { brand, model } })
      .map((values: string[]) => this.toSelectOptions(values));
  }

  getVersions(brand: string, model: string, year: string): Observable<IOption[]> {
    return this.http.get(`${environment.baseUrl}${CARS_SUGGESTER_API_URL}/versions`, { params: { brand, model, year } })
      .map((values: string[]) => this.toSelectOptions(values));
  }

  private toSelectOptions(values: string[]): IOption[] {
    return map(values, (label: string) => ({
      value: label.toString(),
      label: label.toString()
    }));
  }

}
