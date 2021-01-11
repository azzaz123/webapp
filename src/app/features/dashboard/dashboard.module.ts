import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConversationModule } from '@core/conversation/conversation.module';
import { ChatModule } from '@features/chat/chat.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { CallComponent } from './components/call/call.component';
import { StatsGraphComponent } from './components/stats-graph/stats-graph.component';
import { StatisticsService } from './core/services/statistics.service';
import {
  dashboardRoutedComponents,
  DashboardRoutingModule,
} from './dashboard.routing.module';

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
  ],
  declarations: [dashboardRoutedComponents, CallComponent, StatsGraphComponent],
  providers: [StatisticsService],
})
export class DashboardModule {}
