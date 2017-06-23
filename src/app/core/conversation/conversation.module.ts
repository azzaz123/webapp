import { NgModule } from '@angular/core';
import { MessageService, ConversationService, CallService } from 'shield';
import { UserModule } from '../user/user.module';
import { CommonModule } from '@angular/common';
import { ItemModule } from '../item/item.module';
import { MomentModule } from 'angular2-moment';
import { MdIconModule } from '@angular/material';
import { NgbTooltipModule, NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageComponent } from './message/message.component';
import { ConversationComponent } from './conversation/conversation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    ItemModule,
    MomentModule,
    MdIconModule,
    UserModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbModalModule
  ],
  exports: [
    MessageComponent,
    ConversationComponent
  ],
  declarations: [
    MessageComponent,
    ConversationComponent,
  ],
  providers: [
    ConversationService,
    CallService,
    MessageService
  ]
})
export class ConversationModule {
}
