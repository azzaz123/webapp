import { NgModule } from '@angular/core';
import { MapPublishedItemCardModule } from '../map-published-item-card/map-published-item-card.module';
import { PublicProfileService } from '../public-profile.service';
import { PublishedItemCardFavouriteCheckedService } from './published-item-card-favourite-checked.service';

@NgModule({
  imports: [MapPublishedItemCardModule],
  providers: [PublishedItemCardFavouriteCheckedService, PublicProfileService],
})
export class PublishedItemCardFavouriteCheckedModule {}
