import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { IOption } from 'ng-select';
import { HttpService } from '../../core/http/http.service';
import { Brand, BrandModel, Model } from '../brand-model.interface';

@Injectable()
export class GeneralSuggestionsService {

  private API_URL = 'api/v3/suggesters/general';

  constructor(private http: HttpService) {
  }

  getObjectTypes(categoryId: string): Observable<IOption[]> {
    return this.http.get(this.API_URL + '/object-type', { category_id: categoryId })
      .map((r: Response) => r.json())
      .map((types: any[]) => {
        return types
          .filter((type: any) => type.id)
          .map((type: any) => ({
            value: type.id,
            label: type.name
          }));
      });
  }

  getBrandsAndModels(suggestion: string, categoryId: number, objectTypeId: number): Observable<BrandModel[]> {
    return this.http.get(this.API_URL + '/brand-model', {
      text: suggestion,
      category_id: categoryId,
      object_type_id: objectTypeId
    }).map((r: Response) => r.json());
  }

  getModels(suggestion: string, categoryId: number, brand: string, objectTypeId: number): Observable<Model[]> {
    return this.http.get(this.API_URL + '/model', {
      text: suggestion,
      category_id: categoryId,
      brand: brand,
      object_type_id: objectTypeId
    }).map((r: Response) => r.json());
  }

  getBrands(suggestion: string, categoryId: number, objectTypeId): Observable<Brand[]> {
    return this.http.get(this.API_URL + '/brand', {
      text: suggestion,
      category_id: categoryId,
      object_type_id: objectTypeId
    }).map((r: Response) => r.json());
  }

}
