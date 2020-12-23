import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { ReviewItemModule } from '@features/reviews/components/review-item/review-item.module';
import { MapReviewService } from '@public/features/public-profile/pages/user-reviews/services/map-review/map-review.service';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { UserReviewsComponent } from './user-reviews.component';

@NgModule({
  imports: [CommonModule, ReviewItemModule, SpinnerModule],
  declarations: [UserReviewsComponent],
  providers: [MapReviewService],
  exports: [UserReviewsComponent],
})
export class UserReviewsModule {}
