import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  dashboardRoutedComponents,
  DashboardRoutingModule,
} from './dashboard.routing.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownModule } from '@shared/dropdown/dropdown.module';
import { FormsModule } from '@angular/forms';

import { NgxEchartsModule } from 'ngx-echarts';

import { CallComponent } from './components/call/call.component';

import { StatsGraphComponent } from './components/stats-graph/stats-graph.component';
import { StatisticsService } from './core/services/statistics.service';
import { SharedModule } from '@shared/shared.module';
import { ConversationModule } from '@core/conversation/conversation.module';
import { ChatModule } from '@features/chat/chat.module';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    ConversationModule,
    NgbTooltipModule,
    NgxEchartsModule,
    FormsModule,
    ChatModule,
    DropdownModule,
  ],
  declarations: [dashboardRoutedComponents, CallComponent, StatsGraphComponent],
  providers: [StatisticsService],
})
export class DashboardModule {}
