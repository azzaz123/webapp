import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAvatarComponent } from './user-avatar.component';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ProBadgeModule } from '@shared/pro-badge/pro-badge.module';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';

@NgModule({
  declarations: [UserAvatarComponent],
  imports: [CommonModule, SanitizedBackgroundModule, NgxPermissionsModule.forChild(), ProBadgeModule, ImageFallbackModule],
  exports: [UserAvatarComponent],
})
export class UserAvatarModule {}
