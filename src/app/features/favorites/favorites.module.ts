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
import { ItemAvatarModule } from '@shared/item-avatar/item-avatar.module';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';

@NgModule({
  imports: [
    CommonModule,
    FavoritesRoutingModule,
    InfiniteScrollModule,
    SharedModule,
    ItemAvatarModule,
    SanitizedBackgroundModule,
  ],
  declarations: [
    favoritesRoutedComponents,
    ItemCartFavoriteComponent,
    ProfileCardFavoriteComponent,
    ProfileImagesComponent,
  ],
})
export class FavoritesModule {}
