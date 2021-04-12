import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReviewItemModule } from '@core/components/review-item/review-item.module';
import { MapReviewService } from '@public/features/public-profile/pages/user-reviews/services/map-review/map-review.service';
import { EmptyStateModule } from '@public/shared/components/empty-state/empty-state.module';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { UserReviewsComponent } from './user-reviews.component';

@NgModule({
  imports: [CommonModule, ReviewItemModule, SpinnerModule, EmptyStateModule],
  declarations: [UserReviewsComponent],
  providers: [MapReviewService],
  exports: [UserReviewsComponent],
})
export class UserReviewsModule {}
