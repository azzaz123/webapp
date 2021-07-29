import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { favoritesRoutedComponents, FavouritesRoutingModule } from './favourites.routing.module';
import { SharedModule } from '@shared/shared.module';
import { ItemCardFavouriteComponent } from './components/item-card-favourite/item-card-favourite.component';
import { ProfileCardFavoriteComponent } from './components/profile-card-favorite/profile-card-favorite.component';
import { ProfileImagesComponent } from '@shared/profile-images/profile-images.component';
import { ItemAvatarModule } from '@shared/item-avatar/item-avatar.module';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { MeApiModule } from '@api/me/me-api.module';

@NgModule({
  imports: [
    CommonModule,
    FavouritesRoutingModule,
    SharedModule,
    ItemAvatarModule,
    SanitizedBackgroundModule,
    CustomCurrencyModule,
    MeApiModule,
  ],
  declarations: [favoritesRoutedComponents, ItemCardFavouriteComponent, ProfileCardFavoriteComponent, ProfileImagesComponent],
})
export class FavouritesModule {}
