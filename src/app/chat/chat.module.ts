import { NgModule } from '@angular/core';
import { chatRoutedComponents, ChatRoutingModule } from './chat.routes';
import { InputComponent } from './input/input.component';
import { ConnectionAlertComponent } from './connection-alert/connection-alert.component';
import { NgbDropdownModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ItemComponent } from './item/item.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import {
  ReportListingComponent,
  ReportUserComponent,
  BlockUserComponent,
  UnblockUserComponent,
  ArchiveInboxConversationComponent,
  UnarchiveInboxConversationComponent,
} from './modals';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ItemReservedComponent } from './item/item-reserved/item-reserved.component';
import { ItemSoldComponent } from './item/item-sold/item-sold.component';
import { UserResponseRateComponent } from './user-response-rate/user-response-rate.component';
import { TrackingModule } from '../core/tracking/tracking.module';
import { InboxComponent } from './inbox/inbox.component';
import { InboxConversationComponent } from './inbox/inbox-conversation/inbox-conversation.component';
import { CurrentConversationComponent } from './current-conversation/current-conversation.component';
import { ArchivedInboxConversationComponent } from './inbox/archived-inbox-conversation/archived-inbox-conversation.component';
import { InboxUserDetailComponent } from './inbox/inbox-metadata/inbox-user-component/inbox-user-detail.component';
import { InboxItemDetailComponent } from './inbox/inbox-metadata/inbox-item-component/inbox-item-detail.component';
import { ScrollingMessageComponent } from './scrolling-message';
import { InboxItemForSellComponent } from './inbox/inbox-metadata/inbox-item-for-sell/inbox-item-for-sell.component';
import { AutosizeModule } from 'ngx-autosize';
import { MessageModule } from './message/message.module';
import { ConversationDetailsBarComponent } from './conversation-details-bar';
import { MaliciousConversationModalComponent } from './modals/malicious-conversation-modal/malicious-conversation-modal.component';
import { PersonalDataInformationModal } from './modals/personal-data-information-modal/personal-data-information-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
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
    ScrollingMessageComponent,
    ConversationDetailsBarComponent,
    MaliciousConversationModalComponent,
    PersonalDataInformationModal
  ],
  exports: [
    InboxConversationComponent
  ],
  entryComponents: [
    ArchiveInboxConversationComponent,
    UnarchiveInboxConversationComponent,
    ReportListingComponent,
    ReportUserComponent,
    BlockUserComponent,
    UnblockUserComponent,
    MaliciousConversationModalComponent,
    PersonalDataInformationModal
  ]
})
export class ChatModule {
}
