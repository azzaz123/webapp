import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { walletHistoryMovementsRoutedComponents, WalletHistoryMovementsRoutingModule } from './wallet-history-movements.routing.module';
import { TabsBarModule } from '@shared/tabs-bar/tabs-bar.module';
import { WalletBalanceHistoryModule } from '@api/bff/delivery/wallets/balance_history/wallet-balance-history.module';
import { WalletHistoryMovementsUIService } from './services/wallet-history-movements-ui/wallet-history-movements-ui.service';
import { HistoricListModule } from '@shared/historic-list/historic-list.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { WalletHistoryMovementsTrackingEventService } from '@private/features/wallet/pages/wallet-history-movements/services/tracking-event/wallet-history-movements-tracking-event.service';

@NgModule({
  imports: [
    CommonModule,
    WalletBalanceHistoryModule,
    WalletHistoryMovementsRoutingModule,
    TabsBarModule,
    HistoricListModule,
    SvgIconModule,
  ],
  declarations: [walletHistoryMovementsRoutedComponents],
  providers: [WalletHistoryMovementsTrackingEventService, WalletHistoryMovementsUIService],
})
export class WalletHistoryMovementsModule {}
