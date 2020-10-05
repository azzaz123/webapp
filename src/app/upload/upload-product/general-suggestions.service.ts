import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOption } from 'ng-select';
import { Brand, BrandModel, Model, SizesResponse, Size, ObjectType } from '../brand-model.interface';
import { I18nService } from '../../core/i18n/i18n.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ConditionsResponse, Condition } from '../condition.interface';

export const SUGGESTERS_API_URL = 'api/v3/suggesters/general';
export const FASHION_KEYS_API_URL = 'api/v3/fashion/keys';
export const CONDITION_KEYS_API_URL = 'api/v3/consumergoods/keys/condition';

@Injectable()
export class GeneralSuggestionsService {

  constructor(private http: HttpClient, private i18n: I18nService) {
  }

  getObjectTypes(category_id: number): Observable<ObjectType[]> {
    const params = new HttpParams()
      .set('category_id', `${category_id}`)
      .set('language', this.i18n.locale);
    const headers = new HttpHeaders()
      .set('Accept', 'application/vnd.api.v3.suggesters.object-type.v2+json');

    return this.http.get<ObjectType[]>(`${environment.baseUrl}${SUGGESTERS_API_URL}/object-type`, {
      params,
      headers
    })
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

  getConditions(category_id?: number): Observable<IOption[]> {
    return this.http.get<ConditionsResponse[]>(`${environment.baseUrl}${CONDITION_KEYS_API_URL}`, {
      params: {
        language: this.i18n.locale
      }
    })
      .pipe(
        map(r => r.filter(r => +r.category_id === category_id)[0].conditions),
        map((conditions) => {
          return conditions
            .map((condition: Condition) => ({
              value: condition.id,
              label: condition.title,
              description: condition.description
            }));
        })
      )

  }

}
