import { NgModule } from '@angular/core';
import { UuidService } from '@core/uuid/uuid.service';
import { MapPublishedItemCardService } from './map-published-item-card.service';

@NgModule({
  providers: [MapPublishedItemCardService, UuidService],
})
export class MapPublishedItemCardModule {}
