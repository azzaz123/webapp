import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_VERSION_URL } from '@public/core/constants/api-version-url-constants';
import { QueryParams } from '../../../components/filters/core/interfaces/query-params.interface';
import { PaginationOptions } from '../../../components/filters/core/interfaces/pagination-options.interface';
import { FILTER_OPTIONS_API_ENDPOINTS } from '../configurations/filter-options-api-endpoints';
import { ConditionResponse } from '../interfaces/option-responses/condition.interface';
import { ObjectType } from '../interfaces/option-responses/object-type.interface';
import { IconOption } from '../interfaces/option-responses/icon-option.interface';
import { BrandModel } from '../interfaces/option-responses/brand-model.interface';
import { SizeNGenderResponse } from '../interfaces/option-responses/fashion-size-n-gender.interface';
import { FashionBrand } from '../interfaces/option-responses/fashion-brand.interface';
import { ACCEPT_HEADERS, HEADER_NAMES } from '@public/core/constants/header-constants';

export type FilterOptionsApiMethods = keyof Omit<FilterOptionsApiService, 'httpClient' | 'getApiOptions'>;

@Injectable()
export class FilterOptionsApiService {
  constructor(private httpClient: HttpClient) {}

  public getApiOptions(
    method: FilterOptionsApiMethods,
    params: QueryParams,
    paginationOptions: PaginationOptions
  ): Observable<HttpResponse<unknown>> {
    return this[method](params, paginationOptions);
  }

  public getConditionsByCategoryId(params: QueryParams<'category_id'>): Observable<HttpResponse<ConditionResponse>>;
  public getConditionsByCategoryId(params: QueryParams, paginationOptions: PaginationOptions): Observable<HttpResponse<unknown>>;
  public getConditionsByCategoryId(params: QueryParams): Observable<HttpResponse<unknown>> {
    const { category_id, ...rest } = params;
    return this.get<ConditionResponse>(FILTER_OPTIONS_API_ENDPOINTS.CONDITION_BY_CATEGORY_ID(category_id), rest);
  }

  public getObjectTypesByCategoryId(params: QueryParams<'category_id'>): Observable<HttpResponse<ObjectType[]>>;
  public getObjectTypesByCategoryId(params: QueryParams, paginationOptions: PaginationOptions): Observable<HttpResponse<unknown>>;
  public getObjectTypesByCategoryId(params: QueryParams): Observable<HttpResponse<unknown>> {
    return this.get<ObjectType[]>(FILTER_OPTIONS_API_ENDPOINTS.OBJECT_TYPE, params);
  }

  public getObjectTypesByCategoryIdWithChildren(params: QueryParams<'category_id'>): Observable<HttpResponse<ObjectType[]>>;
  public getObjectTypesByCategoryIdWithChildren(
    params: QueryParams,
    paginationOptions: PaginationOptions
  ): Observable<HttpResponse<unknown>>;
  public getObjectTypesByCategoryIdWithChildren(params: QueryParams): Observable<HttpResponse<unknown>> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append(HEADER_NAMES.ACCEPT, ACCEPT_HEADERS.SUGGESTERS_V3);

    return this.get<ObjectType[]>(FILTER_OPTIONS_API_ENDPOINTS.OBJECT_TYPE, params, headers);
  }

  public getBrandModelByCategoryId(params: QueryParams<'category_id'>): Observable<HttpResponse<BrandModel[]>>;
  public getBrandModelByCategoryId(params: QueryParams, paginationOptions: PaginationOptions): Observable<HttpResponse<unknown>>;
  public getBrandModelByCategoryId(params: QueryParams): Observable<HttpResponse<unknown>> {
    return this.get<BrandModel[]>(FILTER_OPTIONS_API_ENDPOINTS.BRAND_MODEL, params);
  }

  public getCarBrandsAndModels(params: QueryParams): Observable<HttpResponse<BrandModel[]>>;
  public getCarBrandsAndModels(params: QueryParams, paginationOptions: PaginationOptions): Observable<HttpResponse<unknown>>;
  public getCarBrandsAndModels(params: QueryParams): Observable<HttpResponse<unknown>> {
    return this.get<BrandModel[]>(FILTER_OPTIONS_API_ENDPOINTS.CARS.BRAND_MODEL, params);
  }

  public getCarBodyTypeKeys(params: QueryParams): Observable<HttpResponse<IconOption[]>>;
  public getCarBodyTypeKeys(params: QueryParams, paginationOptions: PaginationOptions): Observable<HttpResponse<unknown>>;
  public getCarBodyTypeKeys(params: QueryParams): Observable<HttpResponse<unknown>> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.CARS.BODY, params);
  }

  public getCarEngineKeys(params: QueryParams): Observable<HttpResponse<IconOption[]>>;
  public getCarEngineKeys(params: QueryParams, paginationOptions: PaginationOptions): Observable<HttpResponse<unknown>>;
  public getCarEngineKeys(params: QueryParams): Observable<HttpResponse<unknown>> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.CARS.ENGINE, params);
  }

  public getCarGearboxKeys(params: QueryParams): Observable<HttpResponse<IconOption[]>>;
  public getCarGearboxKeys(params: QueryParams, paginationOptions: PaginationOptions): Observable<HttpResponse<unknown>>;
  public getCarGearboxKeys(params: QueryParams): Observable<HttpResponse<unknown>> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.CARS.GEARBOX, params);
  }

  public getRealEstateOperationKeys(params: QueryParams, paginationOptions: PaginationOptions): Observable<HttpResponse<unknown>>;
  public getRealEstateOperationKeys(params: QueryParams): Observable<HttpResponse<IconOption[]>>;
  public getRealEstateOperationKeys(params: QueryParams): Observable<HttpResponse<unknown>> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.REAL_ESTATE.OPERATION, params);
  }

  public getRealEstateTypeKeysByOperationId(params: QueryParams<'operation'>): Observable<HttpResponse<IconOption[]>>;
  public getRealEstateTypeKeysByOperationId(params: QueryParams, paginationOptions?: PaginationOptions): Observable<HttpResponse<unknown>>;
  public getRealEstateTypeKeysByOperationId(params: QueryParams): Observable<HttpResponse<unknown>> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.REAL_ESTATE.TYPE, params);
  }

  public getRealEstateConditions(params: QueryParams): Observable<HttpResponse<IconOption[]>>;
  public getRealEstateConditions(params: QueryParams, paginationOptions?: PaginationOptions): Observable<HttpResponse<unknown>>;
  public getRealEstateConditions(params: QueryParams): Observable<HttpResponse<unknown>> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.REAL_ESTATE.CONDITIONS, params);
  }

  public getRealEstateExtraKeysByTypeId(params: QueryParams<'type'>): Observable<HttpResponse<IconOption[]>>;
  public getRealEstateExtraKeysByTypeId(params: QueryParams, paginationOptions?: PaginationOptions): Observable<HttpResponse<unknown>>;
  public getRealEstateExtraKeysByTypeId(params: QueryParams): Observable<HttpResponse<unknown>> {
    return this.get<IconOption[]>(FILTER_OPTIONS_API_ENDPOINTS.REAL_ESTATE.EXTRA, params);
  }

  public getFashionSizeKeysByObjectId(params: QueryParams<'object_type_id'>): Observable<HttpResponse<SizeNGenderResponse>>;
  public getFashionSizeKeysByObjectId(params: QueryParams, paginationOptions?: PaginationOptions): Observable<HttpResponse<unknown>>;
  public getFashionSizeKeysByObjectId(params: QueryParams): Observable<HttpResponse<unknown>> {
    return this.get<SizeNGenderResponse>(FILTER_OPTIONS_API_ENDPOINTS.FASHION.SIZE, params);
  }

  public getFashionBrandsByObjectTypeId(
    params: QueryParams<'object_type_id'>,
    paginationOptions?: PaginationOptions
  ): Observable<HttpResponse<FashionBrand[]>>;
  public getFashionBrandsByObjectTypeId(params: QueryParams, paginationOptions: PaginationOptions): Observable<HttpResponse<unknown>>;
  public getFashionBrandsByObjectTypeId(
    params: QueryParams<'object_type_id'>,
    paginationOptions: PaginationOptions = { offset: 0 }
  ): Observable<HttpResponse<unknown>> {
    return this.get<FashionBrand[]>(FILTER_OPTIONS_API_ENDPOINTS.FASHION.BRAND, {
      ...params,
      start: paginationOptions.offset.toString(),
    });
  }

  private get<T>(path: string, params: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T>> {
    return this.httpClient.get<T>(`${API_VERSION_URL.v3}${path}`, {
      params,
      headers,
      observe: 'response',
    });
  }
}
