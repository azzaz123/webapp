import { Observable } from 'rxjs';
import { SearchItem } from '@public/features/search/interfaces/search-item.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class SearchFavouritesService {
  private static readonly BASE_URL: string = '/api/v3';

  constructor(private http: HttpClient) {}

  getFavouritesByItems(searchItems: SearchItem[]): Observable<SearchItem[]> {
    const searchItemIds: string[] = searchItems.map(({id}) => id);
    return this.http.post<string[]>(SearchFavouritesService.BASE_URL + '/items/check-favourites', searchItemIds).pipe(
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
