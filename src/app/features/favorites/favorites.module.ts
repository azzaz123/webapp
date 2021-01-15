import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {
  favoritesRoutedComponents,
  FavoritesRoutingModule,
} from './favorites.routing.module';
import { SharedModule } from '@shared/shared.module';
import { ItemCardFavoriteComponent } from './components/item-card-favorite/item-card-favorite.component';
import { ProfileCardFavoriteComponent } from './components/profile-card-favorite/profile-card-favorite.component';
import { ProfileImagesComponent } from '@shared/profile-images/profile-images.component';
import { ItemAvatarModule } from '@shared/item-avatar/item-avatar.module';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';

@NgModule({
  imports: [
    CommonModule,
    FavoritesRoutingModule,
    InfiniteScrollModule,
    SharedModule,
    ItemAvatarModule,
    SanitizedBackgroundModule,
    CustomCurrencyModule,
  ],
  declarations: [
    favoritesRoutedComponents,
    ItemCardFavoriteComponent,
    ProfileCardFavoriteComponent,
    ProfileImagesComponent,
  ],
})
export class FavoritesModule {}
