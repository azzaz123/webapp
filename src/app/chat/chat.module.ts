import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationsPanelComponent } from './conversations-panel/conversations-panel.component';
import { MessagesPanelComponent } from './messages-panel/messages-panel.component';
import { chatRoutedComponents, ChatRoutingModule } from './chat.routes';
import { InputComponent } from './input/input.component';
import { ConnectionAlertComponent } from './connection-alert/connection-alert.component';
import { NgbDropdownModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { MdIconModule } from '@angular/material';
import { MomentModule } from 'angular2-moment';
import { ItemComponent } from './item/item.component';

@NgModule({
  imports: [
    NgbModalModule,
    NgbTooltipModule,
    NgbDropdownModule,
    CommonModule,
    ChatRoutingModule,
    FormsModule,
    MdIconModule,
    MomentModule,
    InfiniteScrollModule
  ],
  declarations: [
    chatRoutedComponents,
    ConversationsPanelComponent,
    MessagesPanelComponent,
    InputComponent,
    ConnectionAlertComponent,
    ItemComponent
  ]
})
export class ChatModule {
}
