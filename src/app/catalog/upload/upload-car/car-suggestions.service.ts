import { Injectable } from '@angular/core';
import { HttpService } from 'shield';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import * as _ from 'lodash';
import { IOption } from 'ng-select';

@Injectable()
export class CarSuggestionsService {

  private API_URL: string = 'api/v3/suggesters/cars';

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
    return _.map(values, (label: string) => ({
      value: label.toString(),
      label: label.toString()
    }));
  }

}
