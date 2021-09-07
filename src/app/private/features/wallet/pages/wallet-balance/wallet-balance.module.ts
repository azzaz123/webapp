import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RequestAndTransactionsPendingAsSellerModule } from '@api/bff/delivery/requests-and-transactions/pending-as-seller/requests-and-transactions-pending-as-seller.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { WalletPendingTransactionComponent } from './components/wallet-pending-transaction/wallet-pending-transaction.component';
import { WalletPendingTransactionsListComponent } from './components/wallet-pending-transactions-list/wallet-pending-transactions-list.component';
import { WalletPendingTransactionsComponent } from './components/wallet-pending-transactions/wallet-pending-transactions.component';
import { WalletBalanceInfoModule } from './modules/wallet-balance-info/wallet-balance-info.module';
import { walletBalanceRoutedComponents, WalletBalanceRoutingModule } from './wallet-balance.routing.module';

@NgModule({
  imports: [CommonModule, WalletBalanceInfoModule, WalletBalanceRoutingModule, RequestAndTransactionsPendingAsSellerModule, SvgIconModule],
  declarations: [
    walletBalanceRoutedComponents,
    WalletPendingTransactionsComponent,
    WalletPendingTransactionComponent,
    WalletPendingTransactionsListComponent,
  ],
})
export class WalletBalanceModule {}
