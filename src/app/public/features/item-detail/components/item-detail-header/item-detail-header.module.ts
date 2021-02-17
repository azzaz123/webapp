import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDetailHeaderComponent } from './item-detail-header.component';
import { UserBasicInfoModule } from '@public/shared/components/user-basic-info/user-basic-info.module';
import { PublicProfileService } from '@public/features/public-profile/core/services/public-profile.service';
import { ButtonModule } from '@shared/button/button.module';
import { FavouriteIconModule } from '@public/shared/components/favourite-icon/favourite-icon.module';

@NgModule({
  declarations: [ItemDetailHeaderComponent],
  imports: [CommonModule, UserBasicInfoModule, ButtonModule, FavouriteIconModule],
  exports: [ItemDetailHeaderComponent],
  providers: [PublicProfileService],
})
export class ItemDetailHeaderModule {}
