import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { UserReviewService } from '@private/features/reviews/core/user-review.service';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';
import { SharedModule } from '@shared/shared.module';
import { StarsModule } from '@shared/stars/stars.module';
import { UserAvatarModule } from '@shared/user-avatar/user-avatar.module';
import { ReviewItemComponent } from './review-item.component';
import { TranslateButtonComponent } from '@core/components/translate-button/translate-button.component';

@NgModule({
  imports: [CommonModule, SvgIconModule, StarsModule, UserAvatarModule, SanitizedBackgroundModule, RouterModule, SharedModule],
  declarations: [ReviewItemComponent, TranslateButtonComponent],
  providers: [UserReviewService],
  exports: [ReviewItemComponent],
})
export class ReviewItemModule {}
