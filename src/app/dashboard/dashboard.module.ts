import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { dashboardRoutedComponents, DashboardRoutingModule } from './dashboard.routes';
import { CallComponent } from './call/call.component';
import { MatIconModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { MomentModule } from 'angular2-moment';
import { ConversationModule } from '../core/conversation/conversation.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { StatsGraphComponent } from './stats-graph/stats-graph.component';
import { AmChartsModule } from '@amcharts/amcharts3-angular';
import { StatisticsService } from './stats-graph/statistics.service';
import { SelectModule } from 'ng-select';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatIconModule,
    SharedModule,
    MomentModule,
    ConversationModule,
    NgbTooltipModule,
    AmChartsModule,
    SelectModule,
    FormsModule
  ],
  declarations: [dashboardRoutedComponents, CallComponent, StatsGraphComponent],
  providers: [StatisticsService]
})
export class DashboardModule { }