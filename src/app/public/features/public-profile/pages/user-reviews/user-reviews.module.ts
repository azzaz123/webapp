import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReviewItemModule } from '@features/reviews/components/review-item/review-item.module';
import { UserReviewsComponent } from './user-reviews.component';

@NgModule({
  imports: [CommonModule, ReviewItemModule],
  declarations: [UserReviewsComponent],
  providers: [],
  exports: [UserReviewsComponent],
})
export class UserReviewsModule {}
