import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { ConversationModule } from './conversation/conversation.module';
import { TrackingModule } from './tracking/tracking.module';

@NgModule({
  imports: [
    ConversationModule,
    CommonModule,
    UserModule,
    ItemModule,
    TrackingModule
  ],
  exports:  [
    ConversationModule,
    CommonModule,
    UserModule,
    ItemModule,
    TrackingModule
  ],
  declarations: []
})
export class CoreModule { }
