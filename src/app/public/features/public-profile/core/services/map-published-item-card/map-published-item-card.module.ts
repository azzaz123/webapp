import { NgModule } from '@angular/core';
import { UuidService } from '@core/uuid/uuid.service';
import { FavoritesApiService } from '@public/core/services/api/favorites/favorites-api.service';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { MapPublishedItemCardService } from './map-published-item-card.service';

@NgModule({
  providers: [MapPublishedItemCardService, UuidService, CheckSessionService, FavoritesApiService],
})
export class MapPublishedItemCardModule {}
