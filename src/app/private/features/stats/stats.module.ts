import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { statsRoutedComponents, StatsRoutingModule } from './stats.routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxEchartsModule } from 'ngx-echarts';
import { ItemStatsGraphComponent } from './components/item-stats-graph/item-stats-graph.component';

import { ItemStatsRowComponent } from './components/item-stats-row/item-stats-row.component';
import { ItemsStatsComponent } from './components/items-stats/items-stats.component';
import { ItemStatsService } from './core/services/item-stats.service';
import { SharedModule } from '@shared/shared.module';
import { ItemAvatarModule } from '@shared/item-avatar/item-avatar.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    StatsRoutingModule,
    SharedModule,
    InfiniteScrollModule,
    NgxEchartsModule,
    ItemAvatarModule,
    CustomCurrencyModule,
    NgbTooltipModule,
  ],
  providers: [ItemStatsService],
  declarations: [statsRoutedComponents, ItemsStatsComponent, ItemStatsRowComponent, ItemStatsGraphComponent],
})
export class StatsModule {}
