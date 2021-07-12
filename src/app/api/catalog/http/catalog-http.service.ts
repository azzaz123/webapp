import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CatalogPublicProfileItemsResponse } from '@api/catalog/dtos/catalog-public-profile-items-response';
import { PUBLISHED_ITEMS_ENDPOINT } from '@api/catalog/http/endpoints';
import { CATALOG_PARAMETERS } from '@api/catalog/http/parameters.enum';
import { HttpClient } from '@angular/common/http';
import { QueryParams } from '@api/core/utils/types';

@Injectable()
export class CatalogHttpService {
  public constructor(private httpClient: HttpClient) {}

  public getUserPublishedItems(userId: string, params?: QueryParams<CATALOG_PARAMETERS>): Observable<CatalogPublicProfileItemsResponse> {
    return this.httpClient.get<CatalogPublicProfileItemsResponse>(PUBLISHED_ITEMS_ENDPOINT(userId), {
      params,
    });
  }
}
