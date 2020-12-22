import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { UserReviewService } from '@features/reviews/core/user-review.service';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';
import { StarsModule } from '@shared/stars/stars.module';
import { UserAvatarModule } from '@shared/user-avatar/user-avatar.module';
import { ReviewItemComponent } from './review-item.component';

@NgModule({
  imports: [
    CommonModule,
    SvgIconModule,
    StarsModule,
    UserAvatarModule,
    SanitizedBackgroundModule,
  ],
  declarations: [ReviewItemComponent],
  providers: [UserReviewService],
  exports: [ReviewItemComponent],
})
export class ReviewItemModule {}
