import { NgModule } from '@angular/core';
import { InboxComponent } from './inbox/inbox.component';
import { InboxConversationComponent } from './conversation/conversation.component';
import { MessagesPanelComponent } from './messages-panel/messages-panel.component';
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
import { InboxService } from './inbox/inbox.service';

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
    InboxComponent,
    MessagesPanelComponent,
    InputComponent,
    ConnectionAlertComponent,
    ItemComponent,
    ItemReservedComponent,
    ItemSoldComponent,
    ArchiveConversationComponent,
    ReportListingComponent,
    ReportUserComponent,
    BlockUserComponent,
    UnblockUserComponent,
    UserDetailComponent,
    UserCardComponent,
    UserResponseRateComponent,
    InboxConversationComponent,
  ],
  entryComponents: [
    ArchiveConversationComponent,
    ReportListingComponent,
    ReportUserComponent,
    BlockUserComponent,
    UnblockUserComponent
  ],
  providers: [InboxService]
})
export class ChatModule {
}
