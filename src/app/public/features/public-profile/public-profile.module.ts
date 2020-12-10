import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PublicProfileRoutingModule,
  publicProfileRoutedComponents,
} from './public-profile-routing.module';
import { StatsComponent } from '@features/stats/pages/stats.component';
import { HeaderComponent } from '@shared/header/header.component';

@NgModule({
  declarations: [
    publicProfileRoutedComponents,
    HeaderComponent,
    StatsComponent,
  ],
  imports: [CommonModule, PublicProfileRoutingModule],
})
export class PublicProfileModule {}
