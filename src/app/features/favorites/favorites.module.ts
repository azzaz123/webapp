import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {
  favoritesRoutedComponents,
  FavoritesRoutingModule,
} from './favorites.routing.module';
import { SharedModule } from '@shared/shared.module';
import { ItemCartFavoriteComponent } from './components/item-cart-favorite/item-cart-favorite.component';
import { ProfileCardFavoriteComponent } from './components/profile-card-favorite/profile-card-favorite.component';
import { ProfileImagesComponent } from '@shared/profile-images/profile-images.component';

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
