import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reviewsRoutedComponents, ReviewsRoutingModule } from './reviews.routes';
import { CoreModule } from '../core/core.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatIconModule } from '@angular/material';
import { ReviewItemComponent } from './review-item/review-item.component';
import { UserReviewService } from './user-review.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ReviewsRoutingModule,
    CoreModule,
    MatIconModule,
    InfiniteScrollModule,
  ],
  declarations: [
    reviewsRoutedComponents,
    ReviewItemComponent
  ],
  providers: [
    UserReviewService
  ]
})
export class ReviewsModule { }
