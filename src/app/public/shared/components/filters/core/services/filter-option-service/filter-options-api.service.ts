import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { QueryParams } from '../../interfaces/query-params.interface';
import { FILTER_OPTIONS_API_ENDPOINTS } from './filter-options-api-endpoints';
import { ConditionResponse } from './option-responses/condition.interface';
import { ObjectType } from './option-responses/object-type.interface';
import { IconOption } from './option-responses/icon-option.interface';
import { BrandModel } from './option-responses/brand-model.interface';
import { SizeNGenderResponse } from './option-responses/fashion-size-n-gender.interface';
import { FashionBrand } from './option-responses/fashion-brand.interface';
import { ACCEPT_HEADERS } from '@public/core/constants/header-constants';
import { API_VERSION_URL } from '@public/core/constants/api-version-url-constants';

@Injectable()
export class FilterOptionsApiService {
  constructor(private httpClient: HttpClient) {}

  public getConditionsByCategoryId(params: QueryParams, ...relatedParams: string[]): Observable<ConditionResponse>;
  public getConditionsByCategoryId(params: QueryParams, categoryId: string): Observable<ConditionResponse> {
    return this.get<ConditionResponse>(FILTER_OPTIONS_API_ENDPOINTS.CONDITION_BY_CATEGORY_ID(categoryId), params);
  }

  public getObjectTypesByCategoryId(params: QueryParams, ...relatedParams: string[]): Observable<ObjectType[]>;
  public getObjectTypesByCategoryId(params: QueryParams, categoryId: string): Observable<ObjectType[]> {
    return this.get<ObjectType[]>(
      FILTER_OPTIONS_API_ENDPOINTS.OBJECT_TYPE,
      {
        ...params,
        category_id: categoryId,
      },
      {
        Accept: ACCEPT_HEADERS.SUGGESTERS_V3,
      }
    );
  }

  public getBrandModelByCategoryId(params: QueryParams, ...relatedParams: string[]): Observable<BrandModel[]>;
  public getBrandModelByCategoryId(params: QueryParams, categoryId: string): Observable<BrandModel[]> {
    return this.get(FILTER_OPTIONS_API_ENDPOINTS.BRAND_MODEL, {
      ...params,
      category_id: categoryId,
    });
  }

  public getCarBrandsAndModels(params: QueryParams, ...relatedParams: string[]): Observable<BrandModel[]>;
  public getCarBrandsAndModels(params: QueryParams): Observable<BrandModel[]> {
    return this.get<BrandModel[]>(FILTER_OPTIONS_API_ENDPOINTS.CARS.BRAND_MODEL, params);
  }

  public getCarBodyTypeKeys(params: QueryParams, ...relatedParams: string[]): Observable<IconOption[]>;
  public getCarBodyTypeKeys(params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.CARS.BODY, params);
  }

  public getCarEngineKeys(params: QueryParams, ...relatedParams: string[]): Observable<IconOption[]>;
  public getCarEngineKeys(params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.CARS.ENGINE, params);
  }

  public getCarGearboxKeys(params: QueryParams, ...relatedParams: string[]): Observable<IconOption[]>;
  public getCarGearboxKeys(params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.CARS.GEARBOX, params);
  }

  public getRealEstateOperationKeys(params: QueryParams, ...relatedParams: string[]): Observable<IconOption[]>;
  public getRealEstateOperationKeys(params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.REAL_ESTATE.OPERATION, params);
  }

  public getRealEstateTypeKeysByOperationId(params: QueryParams, ...relatedParams: string[]): Observable<IconOption[]>;
  public getRealEstateTypeKeysByOperationId(params: QueryParams, operationId: string): Observable<IconOption[]> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.REAL_ESTATE.TYPE, {
      ...params,
      operation: operationId,
    });
  }

  public getRealEstateConditions(params: QueryParams, ...relatedParams: string[]): Observable<IconOption[]>;
  public getRealEstateConditions(params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.REAL_ESTATE.CONDITIONS, params);
  }

  public getRealEstateExtraKeysByTypeId(params: QueryParams, ...relatedParams: string[]): Observable<IconOption[]>;
  public getRealEstateExtraKeysByTypeId(params: QueryParams, typeId: string): Observable<IconOption[]> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.REAL_ESTATE.EXTRA, {
      ...params,
      type: typeId,
    });
  }

  public getFashionSizeKeysByObjectId(params: QueryParams, ...relatedParams: string[]): Observable<SizeNGenderResponse>;
  public getFashionSizeKeysByObjectId(params: QueryParams, objectTypeId: string): Observable<SizeNGenderResponse> {
    return this.get<SizeNGenderResponse>(FILTER_OPTIONS_API_ENDPOINTS.FASHION.SIZE, {
      ...params,
      object_type_id: objectTypeId,
    });
  }

  public getFashionBrandsByObjectTypeId(params: QueryParams, ...relatedParams: string[]): Observable<FashionBrand[]>;
  public getFashionBrandsByObjectTypeId(params: QueryParams, objectTypeId: string, offset?: string): Observable<FashionBrand[]> {
    return this.get<FashionBrand[]>(FILTER_OPTIONS_API_ENDPOINTS.FASHION.BRAND, {
      ...params,
      object_type_id: objectTypeId,
      start: offset,
    });
  }

  private get<T>(path: string, params: QueryParams, headers?: Record<string, string>): Observable<T> {
    return this.httpClient.get<T>(`${API_VERSION_URL.v3}${path}`, {
      params,
      headers,
    });
  }
}
