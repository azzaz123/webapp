import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PublicProfileRoutingModule,
  publicProfileRoutedComponents,
} from './public-profile-routing.module';

@NgModule({
  declarations: [publicProfileRoutedComponents],
  imports: [CommonModule, PublicProfileRoutingModule],
})
export class PublicProfileModule {}
