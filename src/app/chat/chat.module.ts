import { NgModule } from '@angular/core';
import { ConversationsPanelComponent } from './chat-with-archive/conversations-panel/conversations-panel.component';
import { MessagesPanelComponent } from './chat-with-archive/messages-panel/messages-panel.component';
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
import { UserCardComponent } from './user-card/user-card.component';
import { UserResponseRateComponent } from './user-response-rate/user-response-rate.component';
import { TrackingModule } from '../core/tracking/tracking.module';
import { InboxComponent } from './chat-with-inbox/inbox/inbox.component';
import { InboxConversationComponent } from './chat-with-inbox/inbox/inbox-conversation/inbox-conversation.component';
import { ChatWithInboxComponent } from './chat-with-inbox/chat-with-inbox.component';
import { ChatWithArchiveComponent } from './chat-with-archive/chat-with-archive.component';
import { CurrentConversationComponent } from './chat-with-inbox/current-conversation/current-conversation.component';
import { InboxMessageComponent } from './chat-with-inbox/message/inbox-message.component';
import { ArchiveInboxConversationComponent } from './chat-with-inbox/modals/archive-inbox-conversation/archive-inbox-conversation.component';
import { UnarchiveInboxConversationComponent } from './chat-with-inbox/modals/unarchive-inbox-conversation/unarchive-inbox-conversation.component';
import { ArchivedInboxConversationComponent } from './chat-with-inbox/inbox/archived-inbox-conversation/archived-inbox-conversation.component';
import { InboxUserDetailComponent } from './chat-with-inbox/inbox/inbox-metadata/inbox-user-component/inbox-user-detail.component';
import { InboxItemDetailComponent } from './chat-with-inbox/inbox/inbox-metadata/inbox-item-component/inbox-item-detail.component';

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
    TrackingModule
  ],
  declarations: [
    chatRoutedComponents,
    ConversationsPanelComponent,
    MessagesPanelComponent,
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
    UserCardComponent,
    UserResponseRateComponent,
    InboxComponent,
    InboxConversationComponent,
    ArchivedInboxConversationComponent,
    ChatWithInboxComponent,
    ChatWithArchiveComponent,
    CurrentConversationComponent,
    InboxMessageComponent,
    InboxUserDetailComponent,
    InboxItemDetailComponent
  ],
  entryComponents: [
    ArchiveConversationComponent,
    ArchiveInboxConversationComponent,
    UnarchiveInboxConversationComponent,
    ReportListingComponent,
    ReportUserComponent,
    BlockUserComponent,
    UnblockUserComponent
  ]
})
export class ChatModule {
}
