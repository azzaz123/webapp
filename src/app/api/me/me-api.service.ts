import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedList } from '@api/core/model';
import { Item } from '@core/item/item';
import { map, take } from 'rxjs/operators';
import { FavouritesHttpService } from './http/favourites-http.service';
import { FavouritesResponseDto } from './dtos/favourites/response/favourites-response-dto';
import { mapFavouriteItemsToItemCards } from './mappers/favourite-item-mapper';

@Injectable()
export class MeApiService {
  public constructor(private httpService: FavouritesHttpService) {}

  public getFavourites(paginationParameter: string): Observable<PaginatedList<Item>> {
    return this.httpService
      .getFavourites({
        since: paginationParameter,
      })
      .pipe(
        take(1),
        map(({ data, meta }: FavouritesResponseDto) => ({
          list: mapFavouriteItemsToItemCards(data),
          paginationParameter: meta?.next,
        }))
      );
  }
}
