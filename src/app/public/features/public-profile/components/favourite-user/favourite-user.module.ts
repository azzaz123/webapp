import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavouriteUserComponent } from './favourite-user.component';
import { FavouriteIconModule } from '@public/core/components/favourite-icon/favourite-icon.module';
import { PublicProfileService } from '@public/core/services/public-profile.service';

@NgModule({
  declarations: [FavouriteUserComponent],
  imports: [CommonModule, FavouriteIconModule],
  exports: [FavouriteUserComponent],
  providers: [PublicProfileService],
})
export class FavouriteUserModule {}
