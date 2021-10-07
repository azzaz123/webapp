import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bankDetailsRoutedComponents, BankDetailsRoutingModule } from './bank-details.routing.module';
import { WalletSharedErrorActionModule } from '@private/features/wallet/shared/error-action';
import { ExitConfirmGuard } from '@core/guards/exit-confirm.guard';

@NgModule({
  declarations: [bankDetailsRoutedComponents],
  imports: [BankDetailsRoutingModule, CommonModule, WalletSharedErrorActionModule],
  providers: [ExitConfirmGuard],
})
export class BankDetailsModule {}
