import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationImageComponent } from './notification-image.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [NotificationImageComponent],
  imports: [CommonModule, SvgIconModule, SanitizedBackgroundModule],
  exports: [NotificationImageComponent],
})
export class NotificationImageModule {}
