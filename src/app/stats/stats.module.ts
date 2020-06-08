import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { statsRoutedComponents, StatsRoutingModule } from './stats.routes';
import { ItemsStatsComponent } from './items-stats/items-stats.component';
import { SharedModule } from '../shared/shared.module';
import { ItemStatsRowComponent } from './items-stats/item-stats-row/item-stats-row.component';
import { MomentModule } from 'angular2-moment';
import { TrackingModule } from '../core/tracking/tracking.module';
import { MatIconModule } from '@angular/material';
import { ItemStatsGraphComponent } from './items-stats/item-stats-row/item-stats-graph/item-stats-graph.component';
import { ItemStatsService } from './items-stats/item-stats-row/item-stats-graph/item-stats.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [
    CommonModule,
    StatsRoutingModule,
    SharedModule,
    MomentModule,
    TrackingModule,
    MatIconModule,
    InfiniteScrollModule,
    NgxEchartsModule
  ],
  providers: [
    ItemStatsService
  ],
  declarations: [
    statsRoutedComponents,
    ItemsStatsComponent,
    ItemStatsRowComponent,
    ItemStatsGraphComponent
  ]
})
export class StatsModule { }
