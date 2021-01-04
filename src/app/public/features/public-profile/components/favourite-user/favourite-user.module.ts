import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavouriteUserComponent } from './favourite-user.component';
import { CheckSessionModule } from '@public/core/directives/check-session/check-session.module';
import { PublicProfileService } from '@public/features/public-profile/core/services/public-profile.service';
import { FavouriteIconModule } from '@public/shared/components/favourite-icon/favourite-icon.module';

@NgModule({
  declarations: [FavouriteUserComponent],
  imports: [CommonModule, FavouriteIconModule, CheckSessionModule],
  exports: [FavouriteUserComponent],
  providers: [PublicProfileService],
})
export class FavouriteUserModule {}
