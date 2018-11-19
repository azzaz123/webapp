import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { favoritesRoutedComponents, FavoritesRoutingModule } from './favorites.routes';
import { SharedModule } from '../shared/shared.module';
import { ItemCartFavoriteComponent } from './item-cart-favorite/item-cart-favorite.component';
import { ProfileCardFavoriteComponent } from './profile-card-favorite/profile-card-favorite.component';

@NgModule({
  imports: [
    CommonModule,
    FavoritesRoutingModule,
    MatIconModule,
    InfiniteScrollModule,
    SharedModule
  ],
  declarations: [
    favoritesRoutedComponents,
    ItemCartFavoriteComponent,
    ProfileCardFavoriteComponent
  ]
})
export class FavoritesModule { }
