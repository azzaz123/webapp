import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  reviewsRoutedComponents,
  ReviewsRoutingModule,
} from './reviews.routes';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UserReviewService } from './user-review.service';
import { SharedModule } from 'app/shared/shared.module';
import { ReviewItemComponent } from './components/review-item/review-item.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ReviewsRoutingModule,
    InfiniteScrollModule,
  ],
  declarations: [reviewsRoutedComponents, ReviewItemComponent],
  providers: [UserReviewService],
  exports: [reviewsRoutedComponents],
})
export class ReviewsModule {}
