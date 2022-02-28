import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InboxService } from '../chat/core/inbox/inbox.service';
import { InboxPageRoutedComponents, InboxPageRoutingModule } from './inbox-page.routing.module';
import { NotificationsInboxComponent } from './components/notifications-inbox/notifications-inbox.component';
import { NotificationModule } from '@private/features/inbox/components/notification/notification.module';
import { NotificationApiModule } from '@api/notification/notification-api.module';

@NgModule({
  imports: [CommonModule, SharedModule, InboxPageRoutingModule, NotificationModule, NotificationApiModule],
  providers: [InboxService],
  declarations: [InboxPageRoutedComponents, NotificationsInboxComponent],
})
export class InboxPageModule {}
