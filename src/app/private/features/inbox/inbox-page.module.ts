import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InboxService } from '../chat/core/inbox/inbox.service';
import { InboxPageRoutedComponents, InboxPageRoutingModule } from './inbox-page.routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, InboxPageRoutingModule],
  providers: [InboxService],
  declarations: [InboxPageRoutedComponents],
})
export class InboxPageModule {}
