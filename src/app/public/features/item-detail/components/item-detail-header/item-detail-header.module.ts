import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDetailHeaderComponent } from './item-detail-header.component';
import { UserBasicInfoModule } from '@public/shared/components/user-basic-info/user-basic-info.module';
import { PublicProfileService } from '@public/features/public-profile/core/services/public-profile.service';
import { ButtonModule } from '@shared/button/button.module';
import { FavouriteIconModule } from '@public/shared/components/favourite-icon/favourite-icon.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { DateCountDownModule } from '@shared/date-countdown/date-countdown.module';
import { NgbDropdownModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ErrorsService } from '@core/errors/errors.service';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { RouterModule } from '@angular/router';
import { ReviewService } from '@core/review/review.service';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [ItemDetailHeaderComponent],
  imports: [
    CommonModule,
    UserBasicInfoModule,
    ButtonModule,
    FavouriteIconModule,
    SvgIconModule,
    DateCountDownModule,
    NgbModalModule,
    NgbTooltipModule,
    NgbDropdownModule,
    RouterModule,
    NgxPermissionsModule.forChild(),
  ],
  exports: [ItemDetailHeaderComponent],
  providers: [PublicProfileService, ErrorsService, ToastService, ReviewService],
})
export class ItemDetailHeaderModule {}
