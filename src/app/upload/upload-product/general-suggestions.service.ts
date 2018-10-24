import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import * as _ from 'lodash';
import { IOption } from 'ng-select';
import { HttpService } from '../../core/http/http.service';

@Injectable()
export class GeneralSuggestionsService {

  private API_URL = 'api/v3/suggesters/general';

  constructor(private http: HttpService) {
  }

  getObjectTypes(categoryId: string): Observable<IOption[]> {
    return this.http.get(this.API_URL + '/object-type', {category_id: categoryId})
      .map((r: Response) => r.json())
      .map((types: any[]) => {
        return types.map((type: any) => ({
          value: type.id,
          label: type.name
        }));
      });
  }

  getBrands(categoryId: string, objectTypeId): Observable<IOption[]> {
    return this.http.get(this.API_URL + '/brand', {
      category_id: categoryId,
      object_type_id: objectTypeId
    })
      .map((r: Response) => r.json())
      .map((brands: any[]) => {
        return brands.map((brand: any) => ({
          value: brand.brand,
          label: brand.brand
        }));
      });
  }

  getModels(categoryId: string, objectTypeId): Observable<IOption[]> {
    return this.http.get(this.API_URL + '/brand-model', {
      category_id: categoryId,
      object_type_id: objectTypeId
    })
      .map((r: Response) => r.json())
      .map((models: any[]) => {
        return models
          .filter((model: any) => model.model)
          .map((model: any) => ({
            value: model.model,
            label: model.model
          }));
      });
  }

}
