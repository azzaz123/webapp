import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { streamlineOngoingRoutedComponents, StreamlineOngoingRoutingModule } from './streamline-ongoing.routing.module';
import { HistoricListModule } from '@shared/historic-list/historic-list.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { StreamlineOngoingUIService } from '../../services/streamline-ongoing-ui/streamline-ongoing-ui.service';
import { RequestAndTransactionsPendingAsSellerModule } from '@api/bff/delivery/requests-and-transactions/pending-as-seller/requests-and-transactions-pending-as-seller.module';

@NgModule({
  imports: [CommonModule, HistoricListModule, SvgIconModule, RequestAndTransactionsPendingAsSellerModule, StreamlineOngoingRoutingModule],
  declarations: [streamlineOngoingRoutedComponents],
  providers: [StreamlineOngoingUIService],
})
export class StreamlineOngoingModule {}
