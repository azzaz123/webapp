import { NgModule } from '@angular/core';
import { CheckSessionService } from '../check-session/check-session.service';
import { ItemFavouritesService } from './item-favourites.service';

@NgModule({
  providers: [ItemFavouritesService, CheckSessionService],
})
export class ItemFavouritesModule {}
