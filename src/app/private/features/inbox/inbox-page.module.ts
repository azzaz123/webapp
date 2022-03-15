import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inboxPageRoutedComponents, InboxPageRoutingModule } from './inbox-page.routing.module';
import { TabsBarModule } from '@shared/tabs-bar/tabs-bar.module';

@NgModule({
  imports: [CommonModule, SharedModule, InboxPageRoutingModule, TabsBarModule],
  declarations: [inboxPageRoutedComponents],
})
export class InboxPageModule {}
