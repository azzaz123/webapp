import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PublicProfileRoutingModule,
  publicProfileRoutedComponents,
  publicProfileRoutedModules,
} from './public-profile-routing.module';
import { UserStatsComponent } from './components/user-stats/user-stats.component';
import { UserProfileHeaderComponent } from './components/user-profile-header/user-profile-header.component';
import { ProfileTabsComponent } from './components/profile-tabs/profile-tabs.component';
import { FavouriteUserModule } from './components/favourite-user/favourite-user.module';
import { PublicProfileService } from './core/services/public-profile.service';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { UserProfileHeaderModule } from './components/user-profile-header/user-profile-header.module';

@NgModule({
  declarations: [publicProfileRoutedComponents, ProfileTabsComponent],
  imports: [
    CommonModule,
    publicProfileRoutedModules,
    PublicProfileRoutingModule,
    SpinnerModule,
    FavouriteUserModule,
    UserProfileHeaderModule,
  ],
  providers: [PublicProfileService],
})
export class PublicProfileModule {}
