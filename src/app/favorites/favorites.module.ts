import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdIconModule } from '@angular/material';
import { CoreModule } from '../core/core.module';
import { MasonryModule } from 'angular2-masonry';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

import { FavoritesRoutingModule, favoritesRoutedComponents } from './favorites.routes';
import { FavoritesComponent } from './favorites.component';

@NgModule({
  imports: [
    CommonModule,
    FavoritesRoutingModule,
    CoreModule,
    MdIconModule,
    MasonryModule,
    InfiniteScrollModule
  ],
  declarations: [
    FavoritesComponent,
    favoritesRoutedComponents
  ]
})
export class FavoritesModule { }
