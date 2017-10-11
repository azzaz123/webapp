import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavoritesRoutingModule, favoritesRoutedComponents } from './favorites.routes';
import { FavoritesComponent } from './favorites.component';

@NgModule({
  imports: [
    CommonModule,
    FavoritesRoutingModule
  ],
  declarations: [
    FavoritesComponent,
    favoritesRoutedComponents
  ]
})
export class FavoritesModule { }
