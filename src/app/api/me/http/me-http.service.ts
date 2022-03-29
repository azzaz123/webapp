import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FavouritesResponseDto } from '../dtos/favourites/response/favourites-response-dto';
import { HttpClient } from '@angular/common/http';
import { ME_FAVOURITES_ENDPOINT, ME_PUBLISHED_ITEMS, ME_SOLD_ITEMS_ENDPOINT } from '@api/me/http/endpoints';
import { QueryParams } from '@api/core/utils/types';
import { FavouritesQueryParams } from '@api/me/dtos/favourites/request/favourites-query-params';
import { SoldItemResponseDto } from '../dtos/sold/response/sold-response-dto';
import { SoldItemsQueryParams } from '../dtos/sold/request/sold-query-params';
import { PublishedQueryParams } from '../dtos/published/request/published-query-params';
import { PublishedResponseDto } from '../dtos/published/response/published-response-dto';

@Injectable()
export class MeHttpService {
  public constructor(private httpClient: HttpClient) {}

  public getFavourites(params?: QueryParams<FavouritesQueryParams>): Observable<FavouritesResponseDto> {
    return this.httpClient.get<FavouritesResponseDto>(ME_FAVOURITES_ENDPOINT, { params });
  }

  public getSoldItems(params?: QueryParams<SoldItemsQueryParams>): Observable<SoldItemResponseDto> {
    return this.httpClient.get<SoldItemResponseDto>(ME_SOLD_ITEMS_ENDPOINT, { params });
  }

  public getPublishedItems(params?: QueryParams<PublishedQueryParams>): Observable<PublishedResponseDto> {
    return this.httpClient.get<PublishedResponseDto>(ME_PUBLISHED_ITEMS, { params });
  }
}
