import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'angular2-moment';
import { CoreModule } from '../core/core.module';
import { MatIconModule } from '@angular/material';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { CallsComponent } from './calls.component';
import { CallsRoutingModule, callsRoutedComponents } from './calls.routes';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CallItemComponent } from './call-item/call-item.component';
import { CallStatusLabelPipe } from '../core/conversation/call-status-label.pipe';
import { UserCardCallsComponent } from './user-card-calls/user-card-calls.component';

@NgModule({
  imports: [
    CommonModule,
    MomentModule,
    CoreModule,
    MatIconModule,
    NgbTooltipModule,
    SharedModule,
    CallsRoutingModule,
    InfiniteScrollModule
  ],
  exports: [CallStatusLabelPipe],
  declarations: [
    CallsComponent,
    callsRoutedComponents,
    CallItemComponent,
    CallStatusLabelPipe,
    UserCardCallsComponent
  ]
})
export class CallsModule { }
