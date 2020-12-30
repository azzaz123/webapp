import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAvatarComponent } from './user-avatar.component';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';

@NgModule({
  declarations: [UserAvatarComponent],
  imports: [CommonModule, SanitizedBackgroundModule],
  exports: [UserAvatarComponent],
})
export class UserAvatarModule {}
