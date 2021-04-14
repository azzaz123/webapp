import { NgModule } from '@angular/core';
import { FavouritesApiService } from '../api/favourites/favourites-api.service';
import { CheckSessionService } from '../check-session/check-session.service';
import { ItemFavouritesService } from './item-favourites.service';

@NgModule({
  providers: [ItemFavouritesService, CheckSessionService, FavouritesApiService],
})
export class ItemFavouritesModule {}
