import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PublicProfileRoutingModule,
  publicProfileRoutedComponents,
} from './public-profile-routing.module';
import { UserStatsComponent } from './components/user-stats/user-stats.component';
import { UserProfileHeaderComponent } from './components/user-profile-header/user-profile-header.component';
import { ShareUserComponent } from './components/share-user/share-user.component';
import { LikeUserComponent } from './components/like-user/like-user.component';
import { ProfileTabsComponent } from './components/profile-tabs/profile-tabs.component';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';

@NgModule({
  declarations: [
    publicProfileRoutedComponents,
    UserProfileHeaderComponent,
    UserStatsComponent,
    ShareUserComponent,
    LikeUserComponent,
    ProfileTabsComponent,
  ],
  imports: [CommonModule, PublicProfileRoutingModule, SvgIconModule],
})
export class PublicProfileModule {}
