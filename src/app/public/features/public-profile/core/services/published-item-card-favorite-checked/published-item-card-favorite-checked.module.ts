import { NgModule } from '@angular/core';
import { MapPublishedItemCardModule } from '../map-published-item-card/map-published-item-card.module';
import { PublicProfileService } from '../public-profile.service';
import { PublishedItemCardFavoriteCheckedService } from './published-item-card-favorite-checked.service';

@NgModule({
  imports: [MapPublishedItemCardModule],
  providers: [PublishedItemCardFavoriteCheckedService, PublicProfileService],
})
export class PublishedItemCardFavouriteCheckedModule {}
