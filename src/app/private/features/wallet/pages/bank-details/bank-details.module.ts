import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bankDetailsRoutedComponents, BankDetailsRoutingModule } from './bank-details.routing.module';
import { WalletSharedErrorActionModule } from '@private/features/wallet/shared/error-action';

@NgModule({
  declarations: [bankDetailsRoutedComponents],
  imports: [BankDetailsRoutingModule, CommonModule, WalletSharedErrorActionModule],
})
export class BankDetailsModule {}
