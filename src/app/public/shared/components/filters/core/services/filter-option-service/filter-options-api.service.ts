import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

import { QueryParams } from '../../interfaces/query-params';
import { PaginationOptions } from '../../interfaces/pagination-options';
import { FilterOptionApiEndpoints } from './filter-option-api-endpoints.enum';
import { ConditionResponse } from './option-responses/condition.interface';
import { ObjectType } from './option-responses/object-type.interface';
import { IconOption } from './option-responses/icon-option.interface';
import { BrandModel } from './option-responses/brand-model.interface';
import { SizeNGenderResponse } from './option-responses/fashion-size-n-gender.interface';
import { FashionBrand } from './option-responses/fashion-brand.interface';

@Injectable()
export class FilterOptionsApiService {
  constructor(private httpClient: HttpClient) {}

  public getConditionsByCategoryId(categoryId: number, params: QueryParams): Observable<ConditionResponse> {
    return this.get<ConditionResponse>(FilterOptionApiEndpoints.CONDITION.replace('{category_id}', categoryId.toString()), params);
  }

  public getObjectTypesByCategoryId(categoryId: number, params: QueryParams): Observable<ObjectType[]> {
    return this.get<ObjectType[]>(
      FilterOptionApiEndpoints.OBJECT_TYPE,
      {
        ...params,
        category_id: categoryId.toString(),
      },
      {
        Accept: 'application/vnd.api.v3.suggesters.object-type.v3+json',
      }
    );
  }

  public getObjectTypesByParentId(parentId: number, params: QueryParams): Observable<ObjectType[]> {
    return this.get<ObjectType[]>(FilterOptionApiEndpoints.OBJECT_TYPE, {
      ...params,
      parent_id: parentId.toString(),
    });
  }

  public getBrandModelByCategoryId(categoryId: number, params: QueryParams): Observable<BrandModel[]> {
    return this.get(FilterOptionApiEndpoints.BRAND_MODEL, {
      ...params,
      category_id: categoryId.toString(),
    });
  }

  public getCarBrandsAndModels(params: QueryParams): Observable<BrandModel[]> {
    return this.get<BrandModel[]>(FilterOptionApiEndpoints.CAR_BRAND_MODEL, params);
  }

  public getCarBodyTypeKeys(params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FilterOptionApiEndpoints.CAR_BODY, params);
  }

  public getCarEngineKeys(params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FilterOptionApiEndpoints.CAR_ENGINE, params);
  }

  public getCarGearboxKeys(params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FilterOptionApiEndpoints.CAR_GEARBOX, params);
  }

  public getRealEstateOperationKeys(params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FilterOptionApiEndpoints.REAL_ESTATE_OPERATION_TYPE, params);
  }

  public getRealEstateTypeKeysByOperationId(operationId: string, params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FilterOptionApiEndpoints.REAL_ESTATE_TYPE, {
      ...params,
      operation: operationId,
    });
  }

  public getRealEstateExtraKeysByTypeId(typeId: string, params: QueryParams): Observable<IconOption[]> {
    return this.get<IconOption[]>(FilterOptionApiEndpoints.REAL_ESTATE_EXTRA, {
      ...params,
      type: typeId,
    });
  }

  public getFashionSizeKeysByObjectId(objectTypeId: number, params: QueryParams): Observable<SizeNGenderResponse> {
    return this.get<SizeNGenderResponse>(FilterOptionApiEndpoints.FASHION_SIZE, {
      ...params,
      object_type_id: objectTypeId.toString(),
    });
  }

  public getFashionBrandsByObjectTypeId(
    objectTypeId: number,
    params: QueryParams,
    paginationOptions: PaginationOptions = { offset: 0 }
  ): Observable<FashionBrand[]> {
    return this.get<FashionBrand[]>(FilterOptionApiEndpoints.FASHION_BRAND, {
      ...params,
      object_type_id: objectTypeId.toString(),
      start: paginationOptions.offset.toString(),
    });
  }

  private get<T>(path: string, params: QueryParams, headers?: Record<string, string>): Observable<T> {
    const url = `${environment.baseUrl}api/v3`;

    return this.httpClient.get<T>(`${url}${path}`, {
      params,
      headers,
    });
  }
}
