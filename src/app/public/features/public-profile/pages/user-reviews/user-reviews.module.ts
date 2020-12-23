import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReviewItemModule } from '@features/reviews/components/review-item/review-item.module';
import { MapReviewService } from '@public/features/public-profile/pages/user-reviews/services/map-review/map-review.service';
import { UserReviewsComponent } from './user-reviews.component';

@NgModule({
  imports: [CommonModule, ReviewItemModule],
  declarations: [UserReviewsComponent],
  providers: [MapReviewService],
  exports: [UserReviewsComponent],
})
export class UserReviewsModule {}
