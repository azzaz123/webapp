import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '@private/features/inbox/components/notification/notification.component';
import { NotificationImageModule } from '@private/features/inbox/components/notification/notification-image/notification-image.module';

@NgModule({
  declarations: [NotificationComponent],
  imports: [CommonModule, NotificationImageModule],
})
export class NotificationModule {}
