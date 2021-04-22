import { NgModule } from '@angular/core';
import { UuidService } from '@core/uuid/uuid.service';
import { FavouritesApiService } from '@public/core/services/api/favourites/favourites-api.service';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { MapPublishedItemCardService } from './map-published-item-card.service';

@NgModule({
  providers: [MapPublishedItemCardService, UuidService, CheckSessionService, FavouritesApiService],
})
export class MapPublishedItemCardModule {}
