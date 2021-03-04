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

  public getConditionsByCategoryId(filterParams: QueryParams, ...relatedFilterValues: string[]): Observable<ConditionResponse>;
  public getConditionsByCategoryId(filterParams: QueryParams, categoryId: string): Observable<ConditionResponse> {
    return this.get<ConditionResponse>(FILTER_OPTIONS_API_ENDPOINTS.CONDITION_BY_CATEGORY_ID(categoryId), filterParams);
  }

  public getObjectTypesByCategoryId(filterParams: QueryParams, ...relatedFilterValues: string[]): Observable<ObjectType[]>;
  public getObjectTypesByCategoryId(filterParams: QueryParams, categoryId: string): Observable<ObjectType[]> {
    return this.get<ObjectType[]>(
      FILTER_OPTIONS_API_ENDPOINTS.OBJECT_TYPE,
      {
        ...filterParams,
        category_id: categoryId,
      },
      {
        Accept: ACCEPT_HEADERS.SUGGESTERS_V3,
      }
    );
  }

  public getBrandModelByCategoryId(filterParams: QueryParams, ...relatedFilterValues: string[]): Observable<BrandModel[]>;
  public getBrandModelByCategoryId(filterParams: QueryParams, categoryId: string): Observable<BrandModel[]> {
    return this.get(FILTER_OPTIONS_API_ENDPOINTS.BRAND_MODEL, {
      ...filterParams,
      category_id: categoryId,
    });
  }

  public getCarBrandsAndModels(filterParams: QueryParams, ...relatedFilterValues: string[]): Observable<BrandModel[]>;
  public getCarBrandsAndModels(filterParams: QueryParams): Observable<BrandModel[]> {
    return this.get<BrandModel[]>(FILTER_OPTIONS_API_ENDPOINTS.CARS.BRAND_MODEL, filterParams);
  }

  public getCarBodyTypeKeys(filterParams: QueryParams, ...relatedFilterValues: string[]): Observable<IconOption[]>;
  public getCarBodyTypeKeys(filterParams: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.CARS.BODY, filterParams);
  }

  public getCarEngineKeys(filterParams: QueryParams, ...relatedFilterValues: string[]): Observable<IconOption[]>;
  public getCarEngineKeys(filterParams: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.CARS.ENGINE, filterParams);
  }

  public getCarGearboxKeys(filterParams: QueryParams, ...relatedFilterValues: string[]): Observable<IconOption[]>;
  public getCarGearboxKeys(filterParams: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.CARS.GEARBOX, filterParams);
  }

  public getRealEstateOperationKeys(filterParams: QueryParams, ...relatedFilterValues: string[]): Observable<IconOption[]>;
  public getRealEstateOperationKeys(filterParams: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.REAL_ESTATE.OPERATION, filterParams);
  }

  public getRealEstateTypeKeysByOperationId(filterParams: QueryParams, ...relatedFilterValues: string[]): Observable<IconOption[]>;
  public getRealEstateTypeKeysByOperationId(filterParams: QueryParams, operationId: string): Observable<IconOption[]> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.REAL_ESTATE.TYPE, {
      ...filterParams,
      operation: operationId,
    });
  }

  public getRealEstateConditions(filterParams: QueryParams, ...relatedFilterValues: string[]): Observable<IconOption[]>;
  public getRealEstateConditions(filterParams: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.REAL_ESTATE.CONDITIONS, filterParams);
  }

  public getRealEstateExtraKeysByTypeId(filterParams: QueryParams, ...relatedFilterValues: string[]): Observable<IconOption[]>;
  public getRealEstateExtraKeysByTypeId(filterParams: QueryParams, typeId: string): Observable<IconOption[]> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.REAL_ESTATE.EXTRA, {
      ...filterParams,
      type: typeId,
    });
  }

  public getFashionSizeKeysByObjectId(filterParams: QueryParams, ...relatedFilterValues: string[]): Observable<SizeNGenderResponse>;
  public getFashionSizeKeysByObjectId(filterParams: QueryParams, objectTypeId: string): Observable<SizeNGenderResponse> {
    return this.get<SizeNGenderResponse>(FILTER_OPTIONS_API_ENDPOINTS.FASHION.SIZE, {
      ...filterParams,
      object_type_id: objectTypeId,
    });
  }

  public getFashionBrandsByObjectTypeId(filterParams: QueryParams, ...relatedFilterValues: string[]): Observable<FashionBrand[]>;
  public getFashionBrandsByObjectTypeId(filterParams: QueryParams, objectTypeId: string, offset?: string): Observable<FashionBrand[]> {
    return this.get<FashionBrand[]>(FILTER_OPTIONS_API_ENDPOINTS.FASHION.BRAND, {
      ...filterParams,
      object_type_id: objectTypeId,
      start: offset,
    });
  }

  private get<T>(path: string, filterParams: QueryParams, headers?: Record<string, string>): Observable<T> {
    return this.httpClient.get<T>(`${API_VERSION_URL.v3}${path}`, {
      params: filterParams,
      headers,
    });
  }
}
