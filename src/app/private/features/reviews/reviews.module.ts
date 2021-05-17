import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reviewsRoutedComponents, ReviewsRoutingModule } from './reviews.routes';
import { UserReviewService } from './core/user-review.service';
import { SharedModule } from 'app/shared/shared.module';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';
import { ReviewItemModule } from '@core/components/review-item/review-item.module';

@NgModule({
  imports: [SharedModule, CommonModule, ReviewsRoutingModule, ReviewItemModule, SanitizedBackgroundModule],
  declarations: [reviewsRoutedComponents],
  providers: [UserReviewService],
  exports: [reviewsRoutedComponents],
})
export class ReviewsModule {}
