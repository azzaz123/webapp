import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { dashboardRoutedComponents, DashboardRoutingModule } from './dashboard.routes';
import { CallComponent } from './call/call.component';
import { SharedModule } from '../shared/shared.module';
import { ConversationModule } from '../core/conversation/conversation.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { StatsGraphComponent } from './stats-graph/stats-graph.component';
import { StatisticsService } from './stats-graph/statistics.service';
import { DropdownModule } from 'app/dropdown/dropdown.module';
import { FormsModule } from '@angular/forms';
import { ChatModule } from '../chat/chat.module';
import { NgxEchartsModule } from 'ngx-echarts';

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
    DropdownModule
  ],
  declarations: [dashboardRoutedComponents, CallComponent, StatsGraphComponent],
  providers: [
    StatisticsService
  ]
})
export class DashboardModule {
}
