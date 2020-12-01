import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  dashboardRoutedComponents,
  DashboardRoutingModule,
} from './dashboard.routes';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownModule } from 'app/dropdown/dropdown.module';
import { FormsModule } from '@angular/forms';

import { NgxEchartsModule } from 'ngx-echarts';
import { ChatModule } from 'app/chat/chat.module';
import { ConversationModule } from 'app/core/conversation/conversation.module';
import { SharedModule } from 'app/shared/shared.module';
import { CallComponent } from './components/call/call.component';

import { StatsGraphComponent } from './components/stats-graph/stats-graph.component';
import { StatisticsService } from './services/statistics.service';

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
