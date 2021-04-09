import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IsCurrentUserPipe } from '@public/core/pipes/is-current-user/is-current-user.pipe';
import { PublicPipesModule } from '@public/core/pipes/public-pipes.module';
import { PublicUserApiModule } from '@public/core/services/api/public-user/public-user-api.module';
import { ItemFavoritesModule } from '@public/core/services/item-favorites/item-favorites.module';
import { AdSlotModule } from '@shared/ads/ad-slot/ad-slot.module';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { FavouriteUserModule } from './components/favourite-user/favourite-user.module';
import { ProfileTabsComponent } from './components/profile-tabs/profile-tabs.component';
import { UserProfileHeaderModule } from './components/user-profile-header/user-profile-header.module';
import { PublicProfileService } from './core/services/public-profile.service';
import { publicProfileRoutedComponents, publicProfileRoutedModules, PublicProfileRoutingModule } from './public-profile-routing.module';

@NgModule({
  declarations: [publicProfileRoutedComponents, ProfileTabsComponent],
  imports: [
    CommonModule,
    AdSlotModule,
    publicProfileRoutedModules,
    PublicProfileRoutingModule,
    SpinnerModule,
    FavouriteUserModule,
    UserProfileHeaderModule,
    PublicPipesModule,
    PublicUserApiModule,
    ItemFavoritesModule,
  ],
  providers: [PublicProfileService, IsCurrentUserPipe],
})
export class PublicProfileModule {}
