import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PUBLISHED_QUERY_PARAMS, PublishedResponse, WALL_QUERY_PARAMS, WallResponse } from '@api/catalog/dtos';
import { PUBLISHED_ITEMS_ENDPOINT, WALL_ENDPOINT } from '@api/catalog/http/endpoints';
import { HttpClient } from '@angular/common/http';
import { QueryParams } from '@api/core/utils/types';
import { Location } from '@api/core/model/location/location';
import { WALL_HEADERS } from '@api/catalog/dtos/wall/request/wall-headers.enum';

@Injectable()
export class CatalogHttpService {
  public constructor(private httpClient: HttpClient) {}

  public getUserPublishedItems(userId: string, params?: QueryParams<PUBLISHED_QUERY_PARAMS>): Observable<PublishedResponse> {
    return this.httpClient.get<PublishedResponse>(PUBLISHED_ITEMS_ENDPOINT(userId), {
      params,
    });
  }

  public getWall(location: Location, params?: QueryParams<WALL_QUERY_PARAMS>): Observable<WallResponse> {
    return this.httpClient.get<WallResponse>(WALL_ENDPOINT, {
      params,
      headers: {
        [WALL_HEADERS.LATITUDE]: location.latitude.toString(),
        [WALL_HEADERS.LONGITUDE]: location.longitude.toString(),
      },
    });
  }
}
