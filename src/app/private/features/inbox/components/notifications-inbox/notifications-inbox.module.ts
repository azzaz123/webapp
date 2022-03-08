import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationModule } from '@private/features/inbox/components/notification/notification.module';
import { NotificationApiModule } from '@api/notification/notification-api.module';
import {
  notificationsInboxRoutedComponents,
  NotificationsInboxRoutingModule,
} from '@private/features/inbox/components/notifications-inbox/notifications-inbox.routing.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [notificationsInboxRoutedComponents],
  imports: [NotificationModule, NotificationApiModule, CommonModule, SharedModule, NotificationsInboxRoutingModule],
})
export class NotificationsInboxModule {}
