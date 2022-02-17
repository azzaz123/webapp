import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InboxService } from '../chat/core/inbox/inbox.service';
import { InboxRoutedComponents, InboxRoutingModule } from './inbox.routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, InboxRoutingModule],
  providers: [InboxService],
  declarations: [InboxRoutedComponents],
})
export class InboxModule {}
