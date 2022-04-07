import { Component, Input } from '@angular/core';
import { FavouriteSearch } from '@api/core/model/favourites/search/favouriteSearch.interface';

@Component({
  selector: 'tsl-search-card-favourite',
  templateUrl: './search-card-favourite.component.html',
  styleUrls: ['./search-card-favourite.component.scss'],
})
export class SearchCardFavouriteComponent {
  @Input() favouriteSearch: FavouriteSearch;

  constructor() {}

  public handleFavouriteSearchClick(): void {
    console.log('handleFavouriteSearchClick');
  }
}
