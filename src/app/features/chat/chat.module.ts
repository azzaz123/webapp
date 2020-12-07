import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TrackingModule } from '@core/tracking/tracking.module';
import {
  NgbDropdownModule,
  NgbModalModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { AutosizeModule } from 'ngx-autosize';
import { chatRoutedComponents, ChatRoutingModule } from './chat.routes';
import { InboxComponent, InboxConversationComponent } from './children/inbox';
import { InboxItemDetailComponent } from './children/inbox/components/inbox-item-component';
import { InboxItemForSellComponent } from './children/inbox/components/inbox-item-for-sell/inbox-item-for-sell.component';
import { InboxUserDetailComponent } from './children/inbox/components/inbox-user-component';
import { ItemComponent } from './children/item';
import { ItemReservedComponent } from './children/item/components/item-reserved';
import { ItemSoldComponent } from './children/item/components/item-sold';
import { MessageModule } from './children/message';
import { ArchivedInboxConversationComponent } from './components/archived-inbox-conversation';
import { ConnectionAlertComponent } from './components/connection-alert/inbox';
import { ConversationDetailsBarComponent } from './components/conversation-details-bar';
import { CurrentConversationComponent } from './components/current-conversation';
import { InputComponent } from './components/input';
import { ScrollingMessageComponent } from './components/scrolling-message';
import { UserDetailComponent } from './components/user-detail';
import { UserResponseRateComponent } from './components/user-response-rate';
import {
  ArchiveInboxConversationComponent,
  BlockUserComponent,
  ReportListingComponent,
  ReportUserComponent,
  UnarchiveInboxConversationComponent,
  UnblockUserComponent,
} from './modals';
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
    MessageModule,
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
    PersonalDataInformationModal,
  ],
  exports: [InboxConversationComponent],
  entryComponents: [
    ArchiveInboxConversationComponent,
    UnarchiveInboxConversationComponent,
    ReportListingComponent,
    ReportUserComponent,
    BlockUserComponent,
    UnblockUserComponent,
    MaliciousConversationModalComponent,
    PersonalDataInformationModal,
  ],
})
export class ChatModule {}
