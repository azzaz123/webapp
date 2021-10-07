import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ItemAvatarModule } from '@shared/item-avatar/item-avatar.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { SharedModule } from '@shared/shared.module';
import { AutosizeModule } from 'ngx-autosize';
import { chatRoutedComponents, ChatRoutingModule } from './chat.routes';
import { InboxConversationComponent } from './children/inbox/components/inbox-conversation';
import { InboxItemDetailComponent } from './children/inbox/components/inbox-item-component';
import { InboxItemForSellComponent } from './children/inbox/components/inbox-item-for-sell/inbox-item-for-sell.component';
import { InboxUserDetailComponent } from './children/inbox/components/inbox-user-component';
import { InboxComponent } from './children/inbox/inbox.component';
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
import { UserResponseRateModule } from './components/user-response-rate/user-response-rate.module';
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
import { NgxPermissionsModule } from 'ngx-permissions';
import { TranslateButtonModule } from '@core/components/translate-button/translate-button.module';
import { ChatTranslationService } from '@private/features/chat/services/chat-translation.service';
import { ChatApiModule } from '@api/chat/chat-api.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbModalModule,
    SharedModule,
    ChatRoutingModule,
    AutosizeModule,
    MessageModule,
    UserResponseRateModule,
    ItemAvatarModule,
    CustomCurrencyModule,
    NgxPermissionsModule.forChild(),
    TranslateButtonModule,
    ChatApiModule,
  ],
  declarations: [
    chatRoutedComponents,
    InputComponent,
    ConnectionAlertComponent,
    ItemReservedComponent,
    ItemSoldComponent,
    ArchiveInboxConversationComponent,
    UnarchiveInboxConversationComponent,
    ReportListingComponent,
    ReportUserComponent,
    BlockUserComponent,
    UnblockUserComponent,
    UserDetailComponent,
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
  providers: [ChatTranslationService],
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
