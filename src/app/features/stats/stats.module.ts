import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  statsRoutedComponents,
  StatsRoutingModule,
} from './stats.routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxEchartsModule } from 'ngx-echarts';
import { ItemStatsGraphComponent } from './components/item-stats-graph/item-stats-graph.component';

import { ItemStatsRowComponent } from './components/item-stats-row/item-stats-row.component';
import { ItemsStatsComponent } from './components/items-stats/items-stats.component';
import { ItemStatsService } from './core/services/item-stats.service';
import { TrackingModule } from '@core/tracking/tracking.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    StatsRoutingModule,
    SharedModule,
    TrackingModule,
    InfiniteScrollModule,
    NgxEchartsModule,
  ],
  providers: [ItemStatsService],
  declarations: [
    statsRoutedComponents,
    ItemsStatsComponent,
    ItemStatsRowComponent,
    ItemStatsGraphComponent,
  ],
})
export class StatsModule {}
