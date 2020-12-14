import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PublicProfileRoutingModule,
  publicProfileRoutedComponents,
} from './public-profile-routing.module';
import { UserStatsComponent } from './components/user-stats/user-stats.component';
import { UserProfileHeaderComponent } from './components/user-profile-header/user-profile-header.component';
import { ShareUserComponent } from './components/share-user/share-user.component';
import { ProfileTabsComponent } from './components/profile-tabs/profile-tabs.component';
import { FavouriteUserModule } from './components/favourite-user/favourite-user.module';

@NgModule({
  declarations: [
    publicProfileRoutedComponents,
    UserProfileHeaderComponent,
    UserStatsComponent,
    ShareUserComponent,
    ProfileTabsComponent,
  ],
  imports: [CommonModule, PublicProfileRoutingModule, FavouriteUserModule],
})
export class PublicProfileModule {}
