import { NgModule } from '@angular/core';
import { MessageService } from '../message/message.service';
import { ConversationService } from './conversation.service';
import { UserModule } from '../user/user.module';
import { CommonModule } from '@angular/common';
import { ItemModule } from '../item/item.module';
import { MomentModule } from 'angular2-moment';
import { MatIconModule } from '@angular/material';
import { NgbDropdownModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    ItemModule,
    MomentModule,
    MatIconModule,
    UserModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbModalModule,
  ],
  providers: [
    ConversationService,
    MessageService
  ]
})
export class ConversationModule {
}
