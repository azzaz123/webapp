import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { QueryParams } from '../../interfaces/query-params';
import { PaginationOptions } from '../../interfaces/pagination-options';
import { FilterOptionsApiEndpoints } from './filter-options-api-endpoints';
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

  public getConditionsByCategoryId(categoryId: number, params: QueryParams): Observable<ConditionResponse> {
    return this.get<ConditionResponse>(FilterOptionsApiEndpoints.condition(categoryId.toString()), params);
  }

  public getObjectTypesByCategoryId(categoryId: number, params: QueryParams): Observable<ObjectType[]> {
    return this.get<ObjectType[]>(
      FilterOptionsApiEndpoints.objectType,
      {
        ...params,
        category_id: categoryId.toString(),
      },
      {
        Accept: ACCEPT_HEADERS.SUGGESTERS_V3,
      }
    );
  }

  public getObjectTypesByParentId(parentId: number, params: QueryParams): Observable<ObjectType[]> {
    return this.get<ObjectType[]>(FilterOptionsApiEndpoints.objectType, {
      ...params,
      parent_id: parentId.toString(),
    });
  }

  public getBrandModelByCategoryId(categoryId: number, params: QueryParams): Observable<BrandModel[]> {
    return this.get(FilterOptionsApiEndpoints.brandModel, {
      ...params,
      category_id: categoryId.toString(),
    });
  }

  public getCarBrandsAndModels(params: QueryParams): Observable<BrandModel[]> {
    return this.get<BrandModel[]>(FilterOptionsApiEndpoints.cars.brandModel, params);
  }

  public getCarBodyTypeKeys(params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FilterOptionsApiEndpoints.cars.body, params);
  }

  public getCarEngineKeys(params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FilterOptionsApiEndpoints.cars.engine, params);
  }

  public getCarGearboxKeys(params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FilterOptionsApiEndpoints.cars.gearbox, params);
  }

  public getRealEstateOperationKeys(params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FilterOptionsApiEndpoints.realEstate.operation, params);
  }

  public getRealEstateTypeKeysByOperationId(operationId: string, params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FilterOptionsApiEndpoints.realEstate.type, {
      ...params,
      operation: operationId,
    });
  }

  public getRealEstateConditions(params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FilterOptionsApiEndpoints.realEstate.conditions, params);
  }

  public getRealEstateExtraKeysByTypeId(typeId: string, params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FilterOptionsApiEndpoints.realEstate.extra, {
      ...params,
      type: typeId,
    });
  }

  public getFashionSizeKeysByObjectId(objectTypeId: number, params: QueryParams): Observable<SizeNGenderResponse> {
    return this.get<SizeNGenderResponse>(FilterOptionsApiEndpoints.fashion.size, {
      ...params,
      object_type_id: objectTypeId.toString(),
    });
  }

  public getFashionBrandsByObjectTypeId(
    objectTypeId: number,
    params: QueryParams,
    paginationOptions: PaginationOptions = { offset: 0 }
  ): Observable<FashionBrand[]> {
    return this.get<FashionBrand[]>(FilterOptionsApiEndpoints.fashion.brand, {
      ...params,
      object_type_id: objectTypeId.toString(),
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
