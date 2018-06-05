import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'angular2-moment';
import { CoreModule } from '../core/core.module';
import { MatIconModule } from '@angular/material';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { CallsComponent } from './calls.component';
import { callsRoutedComponents, CallsRoutingModule } from './calls.routes';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CallItemComponent } from './call-item/call-item.component';
import { UserCardCallsComponent } from './user-card-calls/user-card-calls.component';
import { ConversationModule } from '../core/conversation/conversation.module';

@NgModule({
  imports: [
    CommonModule,
    MomentModule,
    CoreModule,
    MatIconModule,
    NgbTooltipModule,
    SharedModule,
    CallsRoutingModule,
    InfiniteScrollModule,
    ConversationModule
  ],
  declarations: [
    CallsComponent,
    callsRoutedComponents,
    CallItemComponent,
    UserCardCallsComponent
  ]
})
export class CallsModule { }
