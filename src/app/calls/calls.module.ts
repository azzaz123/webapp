import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { CallsComponent } from './calls.component';
import { callsRoutedComponents, CallsRoutingModule } from './calls.routes';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CallItemComponent } from './call-item/call-item.component';
import { ConversationModule } from '../core/conversation/conversation.module';
import { TrackingModule } from '../core/tracking/tracking.module';

@NgModule({
  imports: [
    CommonModule,
    TrackingModule,
    NgbTooltipModule,
    SharedModule,
    CallsRoutingModule,
    InfiniteScrollModule,
    ConversationModule
  ],
  declarations: [
    CallsComponent,
    callsRoutedComponents,
    CallItemComponent
  ]
})
export class CallsModule { }
