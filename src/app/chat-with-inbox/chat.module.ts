import { NgModule } from '@angular/core';
import { InboxComponent } from './inbox/inbox.component';
import { InboxConversationComponent } from './inbox-conversation/inbox-conversation.component';
import { chatRoutedComponents, ChatRoutingModule } from './chat.routes';
import { ConnectionAlertComponent } from './connection-alert/connection-alert.component';
import { MatIconModule } from '@angular/material';
import { MomentModule } from 'angular2-moment';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MomentModule,
    MatIconModule,
    SharedModule,
    ChatRoutingModule,
  ],
  declarations: [
    chatRoutedComponents,
    InboxComponent,
    ConnectionAlertComponent,
    InboxConversationComponent,
  ]
})
export class ChatModule {
}
