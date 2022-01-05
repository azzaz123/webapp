import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { streamlineCompletedRoutedComponents, StreamlineCompletedRoutingModule } from './streamline-completed.routing.module';
import { HistoricListModule } from '@shared/historic-list/historic-list.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { TransactionsHistoryModule } from '@api/delivery/transactions/history/transactions-history-api.module';
import { StreamlineCompletedUIService } from '../../services/streamline-completed-ui/streamline-completed-ui.service';
import { SharedErrorActionModule, SharedErrorActionService } from '@shared/error-action';
import { StreamlineTrackingEventsService } from '../../services/streamline-tracking-events/streamline-tracking-events.service';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    HistoricListModule,
    SvgIconModule,
    TransactionsHistoryModule,
    StreamlineCompletedRoutingModule,
    RouterModule,
    SharedErrorActionModule,
  ],
  declarations: [streamlineCompletedRoutedComponents],
  providers: [StreamlineCompletedUIService, StreamlineTrackingEventsService, SharedErrorActionService],
})
export class StreamlineCompletedModule {}
