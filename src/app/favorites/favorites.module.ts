import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';

import { FavoritesRoutingModule, favoritesRoutedComponents } from './favorites.routes';
import { FavoritesComponent } from './favorites.component';

@NgModule({
  imports: [
    CommonModule,
    FavoritesRoutingModule,
    CoreModule
  ],
  declarations: [
    FavoritesComponent,
    favoritesRoutedComponents
  ]
})
export class FavoritesModule { }
