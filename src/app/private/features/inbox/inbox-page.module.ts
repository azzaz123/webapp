import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InboxService } from '../chat/core/inbox/inbox.service';
import { inboxPageRoutedComponents, InboxPageRoutingModule } from './inbox-page.routing.module';
import { NotificationsInboxComponent } from './components/notifications-inbox/notifications-inbox.component';
import { TabsBarModule } from '@shared/tabs-bar/tabs-bar.module';

@NgModule({
  imports: [CommonModule, SharedModule, InboxPageRoutingModule, TabsBarModule],
  providers: [InboxService],
  declarations: [inboxPageRoutedComponents],
})
export class InboxPageModule {}
