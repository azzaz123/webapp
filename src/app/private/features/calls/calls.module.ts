import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { callsRoutedComponents, CallsRoutingModule } from './calls.routing.module';
import { CallItemComponent } from './components/call-item/call-item.component';
import { CallsComponent } from './pages/calls.component';
import { ConversationModule } from '@core/conversation/conversation.module';
import { SharedModule } from '@shared/shared.module';
import { ProBadgeModule } from '@shared/pro-badge/pro-badge.module';

@NgModule({
  imports: [CommonModule, NgbTooltipModule, SharedModule, CallsRoutingModule, ConversationModule, ProBadgeModule],
  declarations: [CallsComponent, callsRoutedComponents, CallItemComponent],
})
export class CallsModule {}
