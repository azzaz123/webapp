import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PublicProfileRoutingModule,
  publicProfileRoutedComponents,
} from './public-profile-routing.module';
import { UserStatsComponent } from './components/user-stats/user-stats.component';
import { UserProfileHeaderComponent } from './components/user-profile-header/user-profile-header.component';
import { ProfileTabsComponent } from './components/profile-tabs/profile-tabs.component';
import { SharedModule } from '@shared/shared.module';
import { FavouriteUserModule } from './components/favourite-user/favourite-user.module';
import { UserReviewsModule } from './pages/user-reviews/user-reviews.module';

@NgModule({
  declarations: [
    publicProfileRoutedComponents,
    UserProfileHeaderComponent,
    UserStatsComponent,
    ProfileTabsComponent,
  ],
  imports: [
    CommonModule,
    PublicProfileRoutingModule,
    SharedModule,
    FavouriteUserModule,
    UserReviewsModule,
  ],
})
export class PublicProfileModule {}
