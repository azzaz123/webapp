import { Injectable } from '@angular/core';
import { QueryParams } from '@public/shared/components/filters/core/interfaces/query-params';
import { PaginationOptions } from '@public/shared/components/filters/core/interfaces/pagination-options';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FilterOptionsApiService {
  constructor(private httpClient: HttpClient) {}

  public getConditionsByCategoryId(categoryId: number, params: QueryParams): unknown {
    return;
  }

  public getObjectTypesByCategoryId(categoryId: number, params: QueryParams): unknown {
    return;
  }

  public getObjectTypesByParentId(parentId: number, params: QueryParams): unknown {
    return;
  }

  public getCarBrandsAndModels(params: QueryParams): unknown {
    return;
  }

  public getCarBodyTypeKeys(params?: QueryParams): unknown {
    return;
  }

  public getCarEngineKeys(params?: QueryParams): unknown {
    return;
  }

  public getCarGearboxKeys(params?: QueryParams): unknown {
    return;
  }

  public getRealEstateOperationKeys(params?: QueryParams): unknown {
    return;
  }

  public getRealEstateTypeKeysByOperationId(operationId: string, params?: QueryParams): unknown {
    return;
  }

  public getRealEstateExtraKeysByTypeId(typeId: string, params?: QueryParams): unknown {
    return;
  }

  public getFashionSizeKeysByObjectId(objectTypeId: number, params?: QueryParams): unknown {
    return;
  }

  public getFashionBrandsByObjectTypeId(objectTypeId: number, params?: QueryParams, paginationOptions?: PaginationOptions): unknown {
    return;
  }
}
