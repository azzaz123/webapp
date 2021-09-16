import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { walletHistoryMovementsRoutedComponents, WalletHistoryMovementsRoutingModule } from './wallet-history-movements.routing.module';
import { TabsBarModule } from '@shared/tabs-bar/tabs-bar.module';
import { WalletBalanceHistoryModule } from '@api/bff/delivery/wallets/balance_history/wallet-balance-history.module';
import { WalletHistoryMovementComponent } from './components/wallet-history-movement/wallet-history-movement.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { WalletHistoryMovementsUIService } from './services/wallet-history-movements-ui/wallet-history-movements-ui.service';
import { InfiniteScrollModule } from '@shared/infinite-scroll/infinite-scroll.module';

const walletHistoryMovementsNonRoutedComponents = [WalletHistoryMovementComponent];

@NgModule({
  imports: [
    CommonModule,
    WalletBalanceHistoryModule,
    WalletHistoryMovementsRoutingModule,
    SvgIconModule,
    TabsBarModule,
    InfiniteScrollModule,
  ],
  declarations: [walletHistoryMovementsRoutedComponents, walletHistoryMovementsNonRoutedComponents],
  providers: [WalletHistoryMovementsUIService],
})
export class WalletHistoryMovementsModule {}
