import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { statsRoutedComponents, StatsRoutingModule } from './stats.routes';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxEchartsModule } from 'ngx-echarts';
import { TrackingModule } from 'app/core/tracking/tracking.module';
import { SharedModule } from 'app/shared/shared.module';
import { ItemStatsGraphComponent } from './components/item-stats-graph/item-stats-graph.component';
import { ItemStatsService } from './components/item-stats-graph/item-stats.service';
import { ItemStatsRowComponent } from './components/item-stats-row/item-stats-row.component';
import { ItemsStatsComponent } from './components/items-stats/items-stats.component';

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
