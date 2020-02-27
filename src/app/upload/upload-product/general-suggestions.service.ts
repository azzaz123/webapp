import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IOption } from 'ng-select';
import { Brand, BrandModel, Model, SizesResponse, Size, ObjectType } from '../brand-model.interface';
import { I18nService } from '../../core/i18n/i18n.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const SUGGESTERS_API_URL = 'api/v3/suggesters/general';
export const FASHION_KEYS_API_URL = 'api/v3/fashion/keys';

@Injectable()
export class GeneralSuggestionsService {

  constructor(private http: HttpClient, private i18n: I18nService) {
  }

  getObjectTypes(category_id: number): Observable<IOption[]> {
    return this.http.get(`${environment.baseUrl}${SUGGESTERS_API_URL}/object-type`, {
      params: {
        category_id: category_id,
        language: this.i18n.locale
      } as any
    }).pipe(map((types: ObjectType[]) => {
      return types
        .filter((type: ObjectType) => type.id)
        .map((type: ObjectType) => ({
          value: type.id,
          label: type.name
        }));
    }));
  }

  getBrandsAndModels(suggestion: string, categoryId: number, objectTypeId: number): Observable<BrandModel[]> {
    return this.http.get<BrandModel[]>(`${environment.baseUrl}${SUGGESTERS_API_URL}/brand-model`, {
      params: {
        text: suggestion,
        category_id: categoryId,
        object_type_id: objectTypeId
      } as any
    });
  }

  getModels(suggestion: string, categoryId: number, brand: string, objectTypeId: number): Observable<Model[]> {
    return this.http.get<Model[]>(`${environment.baseUrl}${SUGGESTERS_API_URL}/model`, {
      params: {
        text: suggestion,
        category_id: categoryId,
        brand,
        object_type_id: objectTypeId
      } as any
    })
  }

  getBrands(suggestion: string, categoryId: number, objectTypeId: number): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${environment.baseUrl}${SUGGESTERS_API_URL}/brand`, {
      params: {
        text: suggestion,
        category_id: categoryId,
        object_type_id: objectTypeId
      } as any
    })
  }

  getSizes(objectTypeId: number, gender: string): Observable<IOption[]> {
    return this.http.get(`${environment.baseUrl}${FASHION_KEYS_API_URL}/size`, {
      params: {
        object_type_id: objectTypeId,
        language: this.i18n.locale
      } as any
    }).pipe(map((sizes: SizesResponse) => {
      return sizes[gender]
        .map((size: Size) => ({
          value: String(size.id),
          label: size.text
        }));
    }))
  }

}
