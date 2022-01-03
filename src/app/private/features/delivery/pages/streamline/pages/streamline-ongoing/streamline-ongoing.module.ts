import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { streamlineOngoingRoutedComponents, StreamlineOngoingRoutingModule } from './streamline-ongoing.routing.module';
import { HistoricListModule } from '@shared/historic-list/historic-list.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { StreamlineOngoingUIService } from '../../services/streamline-ongoing-ui/streamline-ongoing-ui.service';
import { RequestAndTransactionsPendingModule } from '@api/bff/delivery/requests-and-transactions/pending/requests-and-transactions-pending.module';
import { AcceptScreenAwarenessModalModule } from '@private/features/delivery/modals/accept-screen-awareness-modal/accept-screen-awareness-modal.module';

@NgModule({
  imports: [
    CommonModule,
    HistoricListModule,
    SvgIconModule,
    RequestAndTransactionsPendingModule,
    AcceptScreenAwarenessModalModule,
    StreamlineOngoingRoutingModule,
  ],
  declarations: [streamlineOngoingRoutedComponents],
  providers: [StreamlineOngoingUIService],
})
export class StreamlineOngoingModule {}
