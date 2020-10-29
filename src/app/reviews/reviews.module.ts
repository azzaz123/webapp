import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reviewsRoutedComponents, ReviewsRoutingModule } from './reviews.routes';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ReviewItemComponent } from './review-item/review-item.component';
import { UserReviewService } from './user-review.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ReviewsRoutingModule,
    InfiniteScrollModule,
  ],
  declarations: [
    reviewsRoutedComponents,
    ReviewItemComponent
  ],
  providers: [
    UserReviewService
  ],
  exports: [
    reviewsRoutedComponents
  ]
})
export class ReviewsModule { }
