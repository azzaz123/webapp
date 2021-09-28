import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAvatarComponent } from './user-avatar.component';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ProBadgeModule } from '@shared/pro-badge/pro-badge.module';

@NgModule({
  declarations: [UserAvatarComponent],
  imports: [CommonModule, SanitizedBackgroundModule, SvgIconModule, NgxPermissionsModule.forChild(), ProBadgeModule],
  exports: [UserAvatarComponent],
})
export class UserAvatarModule {}
