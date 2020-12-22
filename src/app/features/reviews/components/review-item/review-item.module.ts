import { NgModule } from '@angular/core';
import { UserReviewService } from '@features/reviews/core/user-review.service';
import { ReviewItemComponent } from './review-item.component';

@NgModule({
  imports: [],
  declarations: [ReviewItemComponent],
  providers: [UserReviewService],
  exports: [ReviewItemComponent],
})
export class ReviewItemModule {}
