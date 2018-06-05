import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';
import { CoreModule } from '../core/core.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FavoritesRoutingModule, favoritesRoutedComponents } from './favorites.routes';
import { SharedModule } from '../shared/shared.module';
import { ItemCartFavoriteComponent } from './item-cart-favorite/item-cart-favorite.component';

@NgModule({
  imports: [
    CommonModule,
    FavoritesRoutingModule,
    CoreModule,
    MatIconModule,
    InfiniteScrollModule,
    SharedModule
  ],
  declarations: [
    favoritesRoutedComponents,
    ItemCartFavoriteComponent
  ]
})
export class FavoritesModule { }
