import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedList } from '@api/core/model';
import { Item } from '@core/item/item';
import { map, take } from 'rxjs/operators';
import { MeHttpService } from './http/me-http.service';
import { FavouritesResponseDto } from './dtos/favourites/response/favourites-response-dto';
import { mapFavouriteItemsToLegacyItem } from './mappers/favourite-item-mapper';

@Injectable()
export class MeApiService {
  public constructor(private httpService: MeHttpService) {}

  public getFavourites(paginationParameter: string): Observable<PaginatedList<Item>> {
    return this.httpService
      .getFavourites({
        since: paginationParameter,
      })
      .pipe(
        take(1),
        map(({ data, meta }: FavouritesResponseDto) => ({
          list: mapFavouriteItemsToLegacyItem(data),
          paginationParameter: meta?.next,
        }))
      );
  }
}
