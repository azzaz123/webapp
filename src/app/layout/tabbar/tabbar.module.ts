import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabbarComponent } from './components/tabbar.component';
import { TabbarService } from './core/services/tabbar.service';
import { RouterModule } from '@angular/router';
import { SearchTrackingEventsService } from '@public/core/services/search-tracking-events/search-tracking-events.service';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [TabbarComponent],
  providers: [TabbarService, SearchTrackingEventsService],
  exports: [TabbarComponent],
})
export class TabbarModule {}
