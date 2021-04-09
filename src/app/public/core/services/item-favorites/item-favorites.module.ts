import { NgModule } from '@angular/core';
import { FavoritesApiService } from '../api/favorites/favorites-api.service';
import { CheckSessionService } from '../check-session/check-session.service';
import { ItemFavoritesService } from './item-favorites.service';

@NgModule({
  providers: [ItemFavoritesService, CheckSessionService, FavoritesApiService],
})
export class ItemFavoritesModule {}
