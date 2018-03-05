import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';
import { CoreModule } from '../core/core.module';
import { MasonryModule } from 'angular2-masonry';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FavoritesRoutingModule, favoritesRoutedComponents } from './favorites.routes';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FavoritesRoutingModule,
    CoreModule,
    MatIconModule,
    MasonryModule,
    InfiniteScrollModule,
    SharedModule
  ],
  declarations: [
    favoritesRoutedComponents
  ]
})
export class FavoritesModule { }
