import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PublicProfileRoutingModule,
  publicProfileRoutedComponents,
} from './public-profile-routing.module';
import { StatsComponent } from '@features/stats/pages/stats.component';
import { HeaderComponent } from '@shared/header/header.component';
import { ShareUserComponent } from './components/share-user/share-user.component';
import { LikeUserComponent } from './components/like-user/like-user.component';

@NgModule({
  declarations: [
    publicProfileRoutedComponents,
    HeaderComponent,
    StatsComponent,
    ShareUserComponent,
    LikeUserComponent,
  ],
  imports: [CommonModule, PublicProfileRoutingModule],
})
export class PublicProfileModule {}
