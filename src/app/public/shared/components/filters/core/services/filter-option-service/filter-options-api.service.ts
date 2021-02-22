import { Injectable } from '@angular/core';
import { QueryParams } from '@public/shared/components/filters/core/interfaces/query-params';
import { PaginationOptions } from '@public/shared/components/filters/core/interfaces/pagination-options';
import { HttpClient } from '@angular/common/http';
import { FilterOptionApiEndpoints } from '@public/shared/components/filters/core/services/filter-option-service/filter-option-api-endpoints.enum';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class FilterOptionsApiService {
  constructor(private httpClient: HttpClient) {}

  public getConditionsByCategoryId(categoryId: number, params: QueryParams): Observable<unknown> {
    return this.get(FilterOptionApiEndpoints.CONDITION.replace('{category_id}', categoryId.toString()), params);
  }

  public getObjectTypesByCategoryId(categoryId: number, params: QueryParams): Observable<unknown> {
    return this.get(FilterOptionApiEndpoints.OBJECT_TYPE, {
      ...params,
      category_id: categoryId.toString(),
    });
  }

  public getObjectTypesByParentId(parentId: number, params: QueryParams): Observable<unknown> {
    return this.get(FilterOptionApiEndpoints.OBJECT_TYPE, {
      ...params,
      parent_id: parentId.toString(),
    });
  }

  public getBrandModelByCategoryId(categoryId: number, params: QueryParams): Observable<unknown> {
    return this.get(FilterOptionApiEndpoints.BRAND_MODEL, {
      ...params,
      category_id: categoryId.toString(),
    });
  }

  public getCarBrandsAndModels(params: QueryParams): Observable<unknown> {
    return this.get(FilterOptionApiEndpoints.CARS_BRAND_MODEL, params);
  }

  public getCarBodyTypeKeys(params: QueryParams): Observable<unknown> {
    return this.get(FilterOptionApiEndpoints.CARS_BODY, params);
  }

  public getCarEngineKeys(params: QueryParams): Observable<unknown> {
    return this.get(FilterOptionApiEndpoints.CARS_ENGINE, params);
  }

  public getCarGearboxKeys(params: QueryParams): Observable<unknown> {
    return this.get(FilterOptionApiEndpoints.CARS_GEARBOX, params);
  }

  public getRealEstateOperationKeys(params: QueryParams): Observable<unknown> {
    return this.get(FilterOptionApiEndpoints.REAL_ESTATE_OPERATION_TYPE, params);
  }

  public getRealEstateTypeKeysByOperationId(operationId: string, params: QueryParams): Observable<unknown> {
    return this.get(FilterOptionApiEndpoints.REAL_ESTATE_TYPE, {
      ...params,
      operation: operationId,
    });
  }

  public getRealEstateExtraKeysByTypeId(typeId: string, params: QueryParams): Observable<unknown> {
    return this.get(FilterOptionApiEndpoints.REAL_ESTATE_EXTRA, {
      ...params,
      type: typeId,
    });
  }

  public getFashionSizeKeysByObjectId(objectTypeId: number, params: QueryParams): Observable<unknown> {
    return this.get(FilterOptionApiEndpoints.FASHION_SIZE, {
      ...params,
      object_type_id: objectTypeId.toString(),
    });
  }

  public getFashionBrandsByObjectTypeId(
    objectTypeId: number,
    params: QueryParams,
    paginationOptions: PaginationOptions = { offset: 0 }
  ): Observable<unknown> {
    return this.get(FilterOptionApiEndpoints.FASHION_BRAND, {
      ...params,
      object_type_id: objectTypeId.toString(),
      start: paginationOptions.offset.toString(),
    });
  }

  private get<T>(path: string, params: QueryParams): Observable<T> {
    const url = `${environment.baseUrl}api/v3`;

    return this.httpClient.get<T>(`${url}${path}`, {
      params,
    });
  }
}
