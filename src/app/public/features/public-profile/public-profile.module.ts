import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PublicProfileRoutingModule,
  publicProfileRoutedComponents,
} from './public-profile-routing.module';
import { UserStatsComponent } from './components/user-stats/user-stats.component';
import { UserProfileHeaderComponent } from './components/user-profile-header/user-profile-header.component';
import { ShareUserComponent } from './components/share-user/share-user.component';
import { FavouriteUserComponent } from './components/favourite-user/favourite-user.component';
import { ProfileTabsComponent } from './components/profile-tabs/profile-tabs.component';

@NgModule({
  declarations: [
    publicProfileRoutedComponents,
    UserProfileHeaderComponent,
    UserStatsComponent,
    ShareUserComponent,
    FavouriteUserComponent,
    ProfileTabsComponent,
  ],
  imports: [CommonModule, PublicProfileRoutingModule],
})
export class PublicProfileModule {}
