import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabbarComponent } from './components/tabbar.component';
import { TabbarService } from './core/services/tabbar.service';
import { RouterModule } from '@angular/router';
import { SearchTrackingEventsService } from '@public/core/services/search-tracking-events/search-tracking-events.service';
import {
  FilterParameterStoreService,
  FILTER_PARAMETER_DRAFT_STORE_TOKEN,
  FILTER_PARAMETER_STORE_TOKEN,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [TabbarComponent],
  providers: [
    TabbarService,
    SearchTrackingEventsService,
    {
      provide: FILTER_PARAMETER_STORE_TOKEN,
      useClass: FilterParameterStoreService,
    },
    {
      provide: FILTER_PARAMETER_DRAFT_STORE_TOKEN,
      useClass: FilterParameterStoreService,
    },
  ],
  exports: [TabbarComponent],
})
export class TabbarModule {}
