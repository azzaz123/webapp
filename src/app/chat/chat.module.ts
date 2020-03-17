import { NgModule } from '@angular/core';
import { chatRoutedComponents, ChatRoutingModule } from './chat.routes';
import { InputComponent } from './input/input.component';
import { ConnectionAlertComponent } from './connection-alert/connection-alert.component';
import { NgbDropdownModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material';
import { MomentModule } from 'angular2-moment';
import { ItemComponent } from './item/item.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ArchiveConversationComponent } from './modals/archive-conversation/archive-conversation.component';
import { ReportListingComponent } from './modals/report-listing/report-listing.component';
import { ReportUserComponent } from './modals/report-user/report-user.component';
import { BlockUserComponent } from './modals/block-user/block-user.component';
import { UnblockUserComponent } from './modals/unblock-user/unblock-user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ItemReservedComponent } from './item/item-reserved/item-reserved.component';
import { ItemSoldComponent } from './item/item-sold/item-sold.component';
import { UserResponseRateComponent } from './user-response-rate/user-response-rate.component';
import { TrackingModule } from '../core/tracking/tracking.module';
import { InboxComponent } from './inbox/inbox.component';
import { InboxConversationComponent } from './inbox/inbox-conversation/inbox-conversation.component';
import { CurrentConversationComponent } from './current-conversation/current-conversation.component';
import { ArchiveInboxConversationComponent } from './modals/archive-inbox-conversation/archive-inbox-conversation.component';
import { UnarchiveInboxConversationComponent } from './modals/unarchive-inbox-conversation/unarchive-inbox-conversation.component';
import { ArchivedInboxConversationComponent } from './inbox/archived-inbox-conversation/archived-inbox-conversation.component';
import { InboxUserDetailComponent } from './inbox/inbox-metadata/inbox-user-component/inbox-user-detail.component';
import { InboxItemDetailComponent } from './inbox/inbox-metadata/inbox-item-component/inbox-item-detail.component';
import { BlockSendLinkComponent } from './modals/block-send-link';
import { ScrollingMessageComponent } from './scrolling-message';
import { StatusIconComponent } from './inbox/inbox-metadata/status-icon';
import { InboxItemForSellComponent } from './inbox/inbox-metadata/inbox-item-for-sell/inbox-item-for-sell.component';
import { AutosizeModule } from 'ngx-autosize';
import { MessageModule } from './message/message.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MomentModule,
    MatIconModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbModalModule,
    SharedModule,
    ChatRoutingModule,
    TrackingModule,
    AutosizeModule,
    MessageModule
  ],
  declarations: [
    chatRoutedComponents,
    InputComponent,
    ConnectionAlertComponent,
    ItemComponent,
    ItemReservedComponent,
    ItemSoldComponent,
    ArchiveConversationComponent,
    ArchiveInboxConversationComponent,
    UnarchiveInboxConversationComponent,
    ReportListingComponent,
    ReportUserComponent,
    BlockUserComponent,
    UnblockUserComponent,
    UserDetailComponent,
    UserResponseRateComponent,
    InboxComponent,
    InboxConversationComponent,
    ArchivedInboxConversationComponent,
    CurrentConversationComponent,
    InboxUserDetailComponent,
    InboxItemDetailComponent,
    InboxItemForSellComponent,
    BlockSendLinkComponent,
    ScrollingMessageComponent,
    StatusIconComponent
  ],
  exports: [
    InboxConversationComponent
  ],
  entryComponents: [
    ArchiveConversationComponent,
    ArchiveInboxConversationComponent,
    UnarchiveInboxConversationComponent,
    ReportListingComponent,
    ReportUserComponent,
    BlockUserComponent,
    UnblockUserComponent,
    BlockSendLinkComponent
  ]
})
export class ChatModule {
}
