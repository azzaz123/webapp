import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReviewItemModule } from '@features/reviews/components/review-item/review-item.module';
import { UserReviewsService } from '@public/features/public-profile/core/services/user-reviews/user-reviews.service';
import { UserReviewsComponent } from './user-reviews.component';

@NgModule({
  imports: [CommonModule, ReviewItemModule],
  declarations: [UserReviewsComponent],
  providers: [UserReviewsService],
  exports: [UserReviewsComponent],
})
export class UserReviewsModule {}
