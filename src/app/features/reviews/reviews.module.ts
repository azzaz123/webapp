import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  reviewsRoutedComponents,
  ReviewsRoutingModule,
} from './reviews.routes';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { UserReviewService } from './core/user-review.service';
import { SharedModule } from 'app/shared/shared.module';
import { ReviewItemComponent } from './components/review-item/review-item.component';
import { ReviewItemModule } from './components/review-item/review-item.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ReviewsRoutingModule,
    ReviewItemModule,
    InfiniteScrollModule,
  ],
  declarations: [reviewsRoutedComponents],
  providers: [UserReviewService],
  exports: [reviewsRoutedComponents],
})
export class ReviewsModule {}
