import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicProfileRoutingModule, publicProfileRoutedComponents, publicProfileRoutedModules } from './public-profile-routing.module';
import { ProfileTabsComponent } from './components/profile-tabs/profile-tabs.component';
import { FavouriteUserModule } from './components/favourite-user/favourite-user.module';
import { PublicProfileService } from './core/services/public-profile.service';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { UserProfileHeaderModule } from './components/user-profile-header/user-profile-header.module';
import { PublicPipesModule } from '@public/core/pipes/public-pipes.module';
import { PublicUserApiModule } from '@public/core/services/api/public-user/public-user-api.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [publicProfileRoutedComponents, ProfileTabsComponent],
  imports: [
    CommonModule,
    SharedModule,
    publicProfileRoutedModules,
    PublicProfileRoutingModule,
    SpinnerModule,
    FavouriteUserModule,
    UserProfileHeaderModule,
    PublicPipesModule,
    PublicUserApiModule,
  ],
  providers: [PublicProfileService],
})
export class PublicProfileModule {}
