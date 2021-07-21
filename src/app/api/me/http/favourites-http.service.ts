import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FavouritesResponseDto } from '../dtos/favourites/response/favourites-response-dto';
import { HttpClient } from '@angular/common/http';
import { ME_FAVOURITES_ENDPOINT } from '@api/me/http/endpoints';
import { QueryParams } from '@api/core/utils/types';
import { FavouritesQueryParams } from '@api/me/dtos/favourites/request/favourites-query-params';

@Injectable()
export class FavouritesHttpService {
  public constructor(private httpClient: HttpClient) {}

  public getFavourites(params: QueryParams<FavouritesQueryParams>): Observable<FavouritesResponseDto> {
    return this.httpClient.get<FavouritesResponseDto>(ME_FAVOURITES_ENDPOINT, { params });
  }
}
