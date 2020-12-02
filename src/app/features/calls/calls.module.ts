import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { callsRoutedComponents, CallsRoutingModule } from './calls.routes';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CallItemComponent } from './components/call-item/call-item.component';
import { CallsComponent } from './pages/calls.component';
import { ConversationModule } from '@core/conversation/conversation.module';
import { SharedModule } from '@shared/shared.module';
import { TrackingModule } from '@core/tracking/tracking.module';

@NgModule({
  imports: [
    CommonModule,
    TrackingModule,
    NgbTooltipModule,
    SharedModule,
    CallsRoutingModule,
    InfiniteScrollModule,
    ConversationModule,
  ],
  declarations: [CallsComponent, callsRoutedComponents, CallItemComponent],
})
export class CallsModule {}
