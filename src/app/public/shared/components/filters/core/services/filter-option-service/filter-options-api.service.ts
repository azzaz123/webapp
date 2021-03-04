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
import { PaginationOptions } from '@public/shared/components/filters/core/interfaces/pagination-options.interface';

@Injectable()
export class FilterOptionsApiService {
  constructor(private httpClient: HttpClient) {}

  public getConditionsByCategoryId(params: QueryParams, paginationOptions?: PaginationOptions): Observable<unknown>;
  public getConditionsByCategoryId(params: QueryParams<'category_id'>): Observable<ConditionResponse> {
    const { category_id, ...rest } = params;
    return this.get<ConditionResponse>(FILTER_OPTIONS_API_ENDPOINTS.CONDITION_BY_CATEGORY_ID(params.category_id), rest);
  }

  public getObjectTypesByCategoryId(params: QueryParams, paginationOptions?: PaginationOptions): Observable<unknown>;
  public getObjectTypesByCategoryId(params: QueryParams<'category_id'>): Observable<ObjectType[]> {
    return this.get<ObjectType[]>(FILTER_OPTIONS_API_ENDPOINTS.OBJECT_TYPE, params, {
      Accept: ACCEPT_HEADERS.SUGGESTERS_V3,
    });
  }

  public getBrandModelByCategoryId(params: QueryParams, paginationOptions?: PaginationOptions): Observable<unknown>;
  public getBrandModelByCategoryId(params: QueryParams<'category_id'>): Observable<BrandModel[]> {
    return this.get<BrandModel[]>(FILTER_OPTIONS_API_ENDPOINTS.BRAND_MODEL, params);
  }

  public getCarBrandsAndModels(params: QueryParams, paginationOptions?: PaginationOptions): Observable<unknown>;
  public getCarBrandsAndModels(params: QueryParams): Observable<BrandModel[]> {
    return this.get<BrandModel[]>(FILTER_OPTIONS_API_ENDPOINTS.CARS.BRAND_MODEL, params);
  }

  public getCarBodyTypeKeys(params: QueryParams, paginationOptions?: PaginationOptions): Observable<unknown>;
  public getCarBodyTypeKeys(params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.CARS.BODY, params);
  }

  public getCarEngineKeys(params: QueryParams, paginationOptions?: PaginationOptions): Observable<unknown>;
  public getCarEngineKeys(params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.CARS.ENGINE, params);
  }

  public getCarGearboxKeys(params: QueryParams, paginationOptions?: PaginationOptions): Observable<unknown>;
  public getCarGearboxKeys(params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.CARS.GEARBOX, params);
  }

  public getRealEstateOperationKeys(params: QueryParams, paginationOptions?: PaginationOptions): Observable<unknown>;
  public getRealEstateOperationKeys(params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.REAL_ESTATE.OPERATION, params);
  }

  public getRealEstateTypeKeysByOperationId(params: QueryParams, paginationOptions?: PaginationOptions): Observable<unknown>;
  public getRealEstateTypeKeysByOperationId(params: QueryParams<'operation'>): Observable<IconOption[]> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.REAL_ESTATE.TYPE, params);
  }

  public getRealEstateConditions(params: QueryParams, paginationOptions?: PaginationOptions): Observable<unknown>;
  public getRealEstateConditions(params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.REAL_ESTATE.CONDITIONS, params);
  }

  public getRealEstateExtraKeysByTypeId(params: QueryParams, paginationOptions?: PaginationOptions): Observable<unknown>;
  public getRealEstateExtraKeysByTypeId(params: QueryParams<'type'>): Observable<IconOption[]> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.REAL_ESTATE.EXTRA, params);
  }

  public getFashionSizeKeysByObjectId(params: QueryParams, paginationOptions?: PaginationOptions): Observable<unknown>;
  public getFashionSizeKeysByObjectId(params: QueryParams<'object_type_id'>): Observable<SizeNGenderResponse> {
    return this.get<SizeNGenderResponse>(FILTER_OPTIONS_API_ENDPOINTS.FASHION.SIZE, params);
  }

  public getFashionBrandsByObjectTypeId(params: QueryParams, paginationOptions?: PaginationOptions): Observable<unknown>;
  public getFashionBrandsByObjectTypeId(
    params: QueryParams<'object_type_id'>,
    paginationOptions: PaginationOptions = { offset: 0 }
  ): Observable<FashionBrand[]> {
    return this.get<FashionBrand[]>(FILTER_OPTIONS_API_ENDPOINTS.FASHION.BRAND, {
      ...params,
      start: paginationOptions.offset.toString(),
    });
  }

  private get<T>(path: string, params: QueryParams, headers?: Record<string, string>): Observable<T> {
    return this.httpClient.get<T>(`${API_VERSION_URL.v3}${path}`, {
      params,
      headers,
    });
  }
}
