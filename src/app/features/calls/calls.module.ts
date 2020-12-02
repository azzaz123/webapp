import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { callsRoutedComponents, CallsRoutingModule } from './calls.routes';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ConversationModule } from 'app/core/conversation/conversation.module';
import { TrackingModule } from 'app/core/tracking/tracking.module';
import { SharedModule } from 'app/shared/shared.module';
import { CallItemComponent } from './components/call-item/call-item.component';
import { CallsComponent } from './pages/calls.component';

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
