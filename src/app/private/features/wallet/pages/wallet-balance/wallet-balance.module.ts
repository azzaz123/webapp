import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RequestAndTransactionsPendingAsSellerModule } from '@api/bff/delivery/requests-and-transactions/pending-as-seller/requests-and-transactions-pending-as-seller.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { WalletBalanceInfoModule } from '@private/features/wallet/pages/wallet-balance/modules/wallet-balance-info/wallet-balance-info.module';
import { walletBalanceRoutedComponents, WalletBalanceRoutingModule } from './wallet-balance.routing.module';
import { WalletBalanceTrackingEventService } from '@private/features/wallet/pages/wallet-balance/services/wallet-balance-tracking-event.service';
import { WalletPendingTransactionComponent } from '@private/features/wallet/pages/wallet-balance/components/wallet-pending-transaction/wallet-pending-transaction.component';
import { WalletPendingTransactionsComponent } from '@private/features/wallet/pages/wallet-balance/components/wallet-pending-transactions/wallet-pending-transactions.component';
import { WalletPendingTransactionsListComponent } from '@private/features/wallet/pages/wallet-balance/components/wallet-pending-transactions-list/wallet-pending-transactions-list.component';
import { WalletSharedErrorActionModule } from '@private/features/wallet/shared/error-action';
import { WalletTransferModule } from '@private/features/wallet/modals/transfer/wallet-transfer.module';

@NgModule({
  imports: [
    CommonModule,
    WalletBalanceInfoModule,
    WalletBalanceRoutingModule,
    RequestAndTransactionsPendingAsSellerModule,
    SvgIconModule,
    WalletTransferModule,
    WalletSharedErrorActionModule,
  ],
  declarations: [
    walletBalanceRoutedComponents,
    WalletPendingTransactionsComponent,
    WalletPendingTransactionComponent,
    WalletPendingTransactionsListComponent,
  ],
  providers: [WalletBalanceTrackingEventService],
})
export class WalletBalanceModule {}
