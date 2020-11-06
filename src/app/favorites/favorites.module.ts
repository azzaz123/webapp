import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {
  favoritesRoutedComponents,
  FavoritesRoutingModule,
} from './favorites.routes';
import { SharedModule } from '../shared/shared.module';
import { ItemCartFavoriteComponent } from './item-cart-favorite/item-cart-favorite.component';
import { ProfileCardFavoriteComponent } from './profile-card-favorite/profile-card-favorite.component';
import { ProfileImagesComponent } from '../shared/profile-images/profile-images.component';

@NgModule({
  imports: [
    CommonModule,
    FavoritesRoutingModule,
    InfiniteScrollModule,
    SharedModule,
  ],
  declarations: [
    favoritesRoutedComponents,
    ItemCartFavoriteComponent,
    ProfileCardFavoriteComponent,
    ProfileImagesComponent,
  ],
})
export class FavoritesModule {}
