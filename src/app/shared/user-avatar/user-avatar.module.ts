import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAvatarComponent } from './user-avatar.component';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  declarations: [UserAvatarComponent],
  imports: [CommonModule, SanitizedBackgroundModule, SvgIconModule],
  exports: [UserAvatarComponent],
})
export class UserAvatarModule {}
