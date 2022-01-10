import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { streamlineOngoingRoutedComponents, StreamlineOngoingRoutingModule } from './streamline-ongoing.routing.module';
import { HistoricListModule } from '@shared/historic-list/historic-list.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { StreamlineOngoingUIService } from '../../services/streamline-ongoing-ui/streamline-ongoing-ui.service';
import { AcceptScreenAwarenessModalModule } from '@private/features/delivery/modals/accept-screen-awareness-modal/accept-screen-awareness-modal.module';
import { DeliveriesOngoingModule } from '@api/bff/delivery/deliveries/ongoing/deliveries-ongoing.module';

@NgModule({
  imports: [
    CommonModule,
    HistoricListModule,
    SvgIconModule,
    AcceptScreenAwarenessModalModule,
    StreamlineOngoingRoutingModule,
    DeliveriesOngoingModule,
  ],
  declarations: [streamlineOngoingRoutedComponents],
  providers: [StreamlineOngoingUIService],
})
export class StreamlineOngoingModule {}
