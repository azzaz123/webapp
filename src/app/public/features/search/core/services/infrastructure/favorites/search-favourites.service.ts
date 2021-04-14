import { Injectable } from '@angular/core';
import { FavouritesApiService } from '@public/core/services/api/favourites/favourites-api.service';
import { SearchItem } from '@public/features/search/interfaces/search-item.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SearchFavouritesService {

  constructor(private favouritesApiService: FavouritesApiService) {}

  getFavouritesByItems(searchItems: SearchItem[]): Observable<SearchItem[]> {
    const searchItemIds: string[] = searchItems.map(({id}) => id);
    return this.favouritesApiService.getFavouriteItemsId(searchItemIds).pipe(
      map((favouriteIds: string[]) => {
        searchItems.forEach((searchItem: SearchItem) => {
          if (favouriteIds.includes(searchItem.id)) {
            searchItem.flags.favourited = true;
          }
        });
        return searchItems;
      })
    );
  }
 }
