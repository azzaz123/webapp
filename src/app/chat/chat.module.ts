import { NgModule } from '@angular/core';
import { ConversationsPanelComponent } from './conversations-panel/conversations-panel.component';
import { MessagesPanelComponent } from './messages-panel/messages-panel.component';
import { chatRoutedComponents, ChatRoutingModule } from './chat.routes';
import { InputComponent } from './input/input.component';
import { ConnectionAlertComponent } from './connection-alert/connection-alert.component';
import { NgbDropdownModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MdIconModule } from '@angular/material';
import { MomentModule } from 'angular2-moment';
import { ItemComponent } from './item/item.component';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ItemModule } from '../core/item/item.module';
import { UserModule } from '../core/user/user.module';
import { MessageComponent } from './message/message.component';
import { ConversationComponent } from './conversations-panel/conversation/conversation.component';
import { ArchiveConversationComponent } from './modals/archive-conversation/archive-conversation.component';
import { ReportListingComponent } from './modals/report-listing/report-listing.component';
import { ReportUserComponent } from './modals/report-user/report-user.component';
import { BlockUserComponent } from './modals/block-user/block-user.component';
import { UnblockUserComponent } from './modals/unblock-user/unblock-user.component';
import { ReviewButtonComponent } from './message/review-button/review-button.component';
import { ReviewModalComponent } from './message/review-modal/review-modal.component';
import { UtilsModule } from 'shield';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MomentModule,
    ItemModule,
    MdIconModule,
    UserModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbModalModule,
    CoreModule,
    SharedModule,
    ChatRoutingModule,
    UtilsModule
  ],
  declarations: [
    chatRoutedComponents,
    MessageComponent,
    ConversationComponent,
    ConversationsPanelComponent,
    MessagesPanelComponent,
    InputComponent,
    ConnectionAlertComponent,
    ItemComponent,
    ArchiveConversationComponent,
    ReportListingComponent,
    ReportUserComponent,
    BlockUserComponent,
    UnblockUserComponent,
    ReviewButtonComponent,
    ReviewModalComponent
  ],
  entryComponents: [
    ArchiveConversationComponent,
    ReportListingComponent,
    ReportUserComponent,
    BlockUserComponent,
    UnblockUserComponent,
    ReviewModalComponent
  ]
})
export class ChatModule {
}
