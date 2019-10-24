import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';
import { map } from 'lodash';
import { IOption } from 'ng-select';
import { HttpService } from '../../core/http/http.service';

@Injectable()
export class CarSuggestionsService {

  private API_URL = 'api/v3/suggesters/cars';

  constructor(private http: HttpService) {
  }

  getBrands(): Observable<IOption[]> {
    return this.http.get(this.API_URL + '/brands')
    .map((r: Response) => r.json())
    .map((values: string[]) => this.toSelectOptions(values));
  }

  getModels(brand: string): Observable<IOption[]> {
    return this.http.get(this.API_URL + '/models', {brand: brand})
    .map((r: Response) => r.json())
    .map((values: string[]) => this.toSelectOptions(values));
  }

  getYears(brand: string, model: string): Observable<IOption[]> {
    return this.http.get(this.API_URL + '/years', {brand: brand, model: model})
    .map((r: Response) => r.json())
    .map((values: string[]) => this.toSelectOptions(values));
  }

  getVersions(brand: string, model: string, year: string): Observable<IOption[]> {
    return this.http.get(this.API_URL + '/versions', {brand: brand, model: model, year: year})
    .map((r: Response) => r.json())
    .map((values: string[]) => this.toSelectOptions(values));
  }

  private toSelectOptions(values: string[]): IOption[] {
    return map(values, (label: string) => ({
      value: label.toString(),
      label: label.toString()
    }));
  }

}
