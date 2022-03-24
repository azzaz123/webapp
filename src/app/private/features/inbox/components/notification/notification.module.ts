import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '@private/features/inbox/components/notification/notification.component';
import { NotificationImageModule } from '@private/features/inbox/components/notification/notification-image/notification-image.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [NotificationComponent],
  imports: [CommonModule, NotificationImageModule, SharedModule],
  exports: [NotificationComponent],
})
export class NotificationModule {}
