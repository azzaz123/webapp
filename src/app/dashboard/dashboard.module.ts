import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { dashboardRoutedComponents, DashboardRoutingModule } from './dashboard.routes';
import { CallComponent } from './call/call.component';
import { MatIconModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { MomentModule } from 'angular2-moment';
import { ConversationModule } from '../core/conversation/conversation.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatIconModule,
    SharedModule,
    MomentModule,
    ConversationModule,
    NgbTooltipModule
  ],
  declarations: [dashboardRoutedComponents, CallComponent]
})
export class DashboardModule { }
