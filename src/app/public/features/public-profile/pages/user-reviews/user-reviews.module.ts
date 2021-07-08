import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReviewItemModule } from '@core/components/review-item/review-item.module';
import { EmptyStateModule } from '@public/shared/components/empty-state/empty-state.module';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { UserReviewsComponent } from './user-reviews.component';
import { ReviewsApiModule } from '@api/reviews';

@NgModule({
  imports: [CommonModule, ReviewItemModule, SpinnerModule, EmptyStateModule, ReviewsApiModule],
  declarations: [UserReviewsComponent],
  exports: [UserReviewsComponent],
})
export class UserReviewsModule {}
